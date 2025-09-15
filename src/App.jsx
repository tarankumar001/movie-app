// 🔹 Import React + Hooks we need
// React = main library to build UI components
// useState = lets us create "state" variables (memory to store data)
// useEffect = lets us run code at certain points (like page load)
// useDebounce = custom hook to delay actions while typing (from react-use)
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

// 🔹 Import our components
import Search from './components/search';      // Search input bar component
import { Spinner } from './components/spinner'; // Loading spinner component
import MoiveCard from './components/MoiveCard'; // Component to display each movie
import { getTrendingMovies, updateSearchCount } from '../appwrite'; // Appwrite DB helper functions

// =======================
// 🔹 API Setup for TMDB
// =======================

// Base URL of TMDB API (all requests start with this)
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Our secret API Key (kept in .env for security)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Options we send to fetch API (method + headers)
const API_OPTIONS = {
  method: 'GET', // We want to GET data
  headers: {
    accept: 'application/json', // Tell API we want JSON response
    Authorization: `Bearer ${API_KEY}`, // Pass our TMDB v4 token
  },
};

// =======================
// 🔹 Main App Component
// =======================
const App = () => {
  // =======================
  // 🔹 State Variables (memory for our app)
  // =======================

  const [searchTerm, setSearchTerm] = useState(''); // Text typed in search bar
  const [movieList, setMovieList] = useState([]);   // Movies fetched from TMDB (filtered)
  const [errorMessage, setErrorMessage] = useState(''); // To store error messages
  const [isLoading, setIsLoading] = useState(false);    // Loading spinner toggle
  const [debounceSearchTerm, setDebouncedSearchTerm] = useState(''); // Delayed searchTerm for debounce
  const [trendingMovies, setTrendingMovies] = useState([]); // List of trending movies

  // =======================
  // 🔹 Function to fetch movies from TMDB
  // =======================
  const fetchMovies = async (query = '') => {
    setIsLoading(true);   // Start spinner
    setErrorMessage('');  // Clear old errors

    try {
      // If we have a search query → use search endpoint
      // Otherwise → fetch popular movies
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Call the TMDB API
      const response = await fetch(endpoint, API_OPTIONS);

      // If API returns error (like 401/404) → throw error
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json(); // Convert API response to JS object

      // TMDB sometimes returns Response: "False" → show message
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies'); // Show API error
        setMovieList([]); // Clear movies
        return;
      }

      // Save results into state (so UI re-renders)
      setMovieList(data.results || []);

      // If search query exists, update count in Appwrite DB
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`); // Log for dev
      setErrorMessage('Could not load movies. Try again later.'); // Show user-friendly message
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  // =======================
  // 🔹 Function to load trending movies (Appwrite DB)
  // =======================
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // Fetch trending movies from DB
      setTrendingMovies(movies); // Save in state
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  };

  // =======================
  // 🔹 Debounce searchTerm
  // =======================
  // Delay updating debounced value until user stops typing for 500ms
  // Prevents calling API on every single keypress
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // =======================
  // 🔹 Fetch movies whenever debounced search term changes
  // =======================
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]); // Dependency = only runs when debounceSearchTerm changes

  // =======================
  // 🔹 Load trending movies on page load
  // =======================
  useEffect(() => {
    loadTrendingMovies();
  }, []); // Empty array → run only once on mount

  // =======================
  // 🔹 JSX → UI Layout
  // =======================
  return (
    <main>
      {/* Background pattern */}
      <div className="pattern" />

      {/* Wrapper container */}
      <div className="wrapper">
        {/* Header section */}
        <header>
          <img src="./hero.png" alt="Hero Banner" /> {/* Banner image */}
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle
          </h1>
          {/* Search bar */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* TRENDING MOVIES SECTION */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p> {/* Show ranking */}
                  <img src={movie.poster_url} alt={movie.title} /> {/* Movie poster */}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ALL MOVIES SECTION */}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner /> // Show spinner while fetching
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p> // Show error if any
          ) : (
            <ul
              className="grid gap-6 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5"
            >
              {movieList.map((movie) => (
                <MoiveCard key={movie.id} movie={movie} /> // Render each movie card
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

// Export App so React can render it
export default App;
