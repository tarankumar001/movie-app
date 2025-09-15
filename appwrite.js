import { Client, Databases, Query, ID, Permission, Role } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // normalize search term
    const normalizedTerm = searchTerm.trim().toLowerCase();

    // look for existing row with normalizedTerm
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", normalizedTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        { count: doc.count + 1 }
      );
      console.log("Updated count for:", normalizedTerm);
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: normalizedTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
        ]
      );
      console.log("Created new row for:", normalizedTerm);
    }
  } catch (error) {
    console.error("Appwrite error:", error);
  }
};


export const getTrendingMovies=async()=>{
    try{
        const result = await database.listDocuments(
  DATABASE_ID,
  COLLECTION_ID,
  [
    Query.limit(5),
    Query.orderDesc("count"),
  ]
);

        return result.documents;
    }catch(error){
        console.error("Appwrite error:",error);
        return [];
    }
}