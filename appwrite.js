// 🔹 Import Appwrite SDK modules
// Client = main object to connect Appwrite
// Databases = access your database collections
// Query = to filter / order / limit queries
// ID = helper to generate unique IDs
// Permission + Role = control who can read/write documents
import { Client, Databases, Query, ID, Permission, Role } from "appwrite";

// 🔹 Get environment variables (hidden keys, not hardcoded)
// These are set in your .env file
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// 🔹 Create Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite server URL
  .setProject(PROJECT_ID);                     // Link to your project

// 🔹 Create database object to access DB operations
const database = new Databases(client);

// =======================
// 🔹 Function: updateSearchCount
// =======================
// This is called every time user searches a movie
// It will save the search term + count + poster in Appwrite
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Normalize search term → remove spaces + lowercase
    const normalizedTerm = searchTerm.trim().toLowerCase();

    // Check if this term already exists in DB
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", normalizedTerm)] // filter: searchTerm == normalizedTerm
    );

    if (result.documents.length > 0) {
      // Term exists → update count
      const doc = result.documents[0]; // get the first matching doc
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,             // which document to update
        { count: doc.count + 1 } // increment count by 1
      );
      console.log("Updated count for:", normalizedTerm);
    } else {
      // Term does NOT exist → create new document
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(), // generate unique ID for the new doc
        {
          searchTerm: normalizedTerm,                         // store normalized search term
          count: 1,                                           // first search = count 1
          movie_id: movie.id,                                 // store TMDB movie ID
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`, // save poster URL
        },
        [
          Permission.read(Role.any()),  // anyone can read
          Permission.write(Role.any()), // anyone can write (update count)
        ]
      );
      console.log("Created new row for:", normalizedTerm);
    }
  } catch (error) {
    console.error("Appwrite error:", error); // log if anything goes wrong
  }
};

// =======================
// 🔹 Function: getTrendingMovies
// =======================
// Get top 5 movies sorted by count (most searched)
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.limit(5),          // limit to 5 results
        Query.orderDesc("count") // sort descending by count
      ]
    );

    return result.documents; // return array of documents
  } catch (error) {
    console.error("Appwrite error:", error);
    return []; // return empty array if error occurs
  }
};
