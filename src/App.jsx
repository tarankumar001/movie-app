// 🔹 Import React + Hooks we need
// React = main library for building UI
// useState = lets us create "state" (memory variables)
// useEffect = lets us run code at certain times (like componentDidMount)
import React, { useEffect, useState } from 'react';

// 🔹 Import our Search component (capital S!)
// This is our custom search bar component
import Search from './components/search';
import { Spinner } from './components/spinner';
import MoiveCard from './components/MoiveCard';

// =======================
// 🔹 API Setup for TMDB
// =======================

// Base URL for TMDB API (every API call starts with this)
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Our secret TMDB API token (stored in .env so it's not public)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Options for fetch API call
// method = GET → we want to "get" data from server
// headers → tell API we accept JSON + give authorization token
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`, // ✅ Pass token to TMDB
  },
};

// =======================
// 🔹 Main App Component
// =======================
const App = () => {
  // =======================
  // 🔹 STATE VARIABLES
  // =======================

  // searchTerm = text typed in search bar
  // setSearchTerm = function to change searchTerm
  const [searchTerm, setSearchTerm] = useState('');

  // movieList = array of movies we fetch from API
  // setMovieList = function to update movieList
  const [movieList, setMovieList] = useState([]);

  // errorMessage = if API fails, store message here
  // setErrorMessage = function to update error message
  const [errorMessage, setErrorMessage] = useState('');

  // isLoading = true/false while API is fetching
  // setIsLoading = function to update loading state
  const [isLoading, setIsLoading] = useState(false);

  // =======================
  // 🔹 Function to fetch movies from TMDB
  // =======================
  const fetchMovies = async (query='') => {
    setIsLoading(true);    // start loading spinner
    setErrorMessage('');   // reset any old errors

    try {
      // Build API endpoint URL
      // /discover/movie → endpoint to get list of movies
      // ?sort_by=popularity.desc → sort movies by popularity
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // fetch() → call API, wait for response
      const response = await fetch(endpoint, API_OPTIONS);

      // If response is not OK (status not 200), throw error
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      // Convert raw response into JS object
      const data = await response.json();

      console.log(data); // log data to console for debugging

      // Save movies into state (so React re-renders UI)
      setMovieList(data.results || []);

    } catch (error) {
      // If something went wrong, log in console
      console.error(`Error fetching movies: ${error}`);
      // Show user-friendly error message
      setErrorMessage('Could not load movies. Try again later.');
    } finally {
      setIsLoading(false); // stop loading spinner
    }
  };

  // =======================
  // 🔹 useEffect → run code when component loads
  // =======================
  useEffect(() => {
    fetchMovies(searchTerm); // call fetchMovies once on page load
  }, [searchTerm]); // empty array = run only once

  // =======================
  // 🔹 JSX → UI layout
  // =======================
  return (
    <main>
      {/* background pattern (styling) */}
      <div className="pattern" />

      {/* wrapper = main container for content */}
      <div className="wrapper">
        {/* HEADER section */}
        <header>
          {/* Hero banner image */}
          <img src="./hero.png" alt="Hero Banner" />

          {/* Main heading */}
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle
          </h1>

          {/* Search component */}
          {/* Pass searchTerm + setSearchTerm to component */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* MOVIES SECTION */}
        <section>
          {/* Sub-heading */}
          <h2 className="mt-[40px]">All Movies</h2>

          {/* Conditional rendering */}
          {isLoading ? (
            // Show loading text while fetching
            <Spinner/>
          ) : errorMessage ? (
            // Show error if fetch fails
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            // Otherwise show movie list
            <ul className="grid gap-6 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5">
              {movieList.map((movie) => (
                // Each movie gets a unique key = movie.id
                <MoiveCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>

        {/*
          🔹 Bro summary:
          - useState = notepad + pen
          - searchTerm = typed text
          - setSearchTerm = pen to update typed text
          - movieList = array of movies
          - errorMessage = store error if fetch fails
          - isLoading = true/false while fetching
          - useEffect = run code on component load
          - fetchMovies = function to get movies from TMDB
        */}
      </div>
    </main>
  );
};

// 🔹 Export App so React can render it
export default App;
