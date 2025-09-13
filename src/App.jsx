// 🔹 Import React and the Hooks we need
// React = main library, useState = lets us make "memory variables", useEffect = run code at certain times
import React, { useEffect, useState } from 'react';

// 🔹 Import our Search component (must start with capital S)
import Search from './components/search';

// =======================
// 🔹 API Setup (for TMDB)
// =======================

// Base URL of TheMovieDB API (every request starts with this)
const API_BASE_URL = 'https://api.themoviedb.org/3';

// API Key (we keep it safe inside .env file so it’s not hardcoded here)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Options for fetch request
// method: 'GET' means we are "getting data"
// headers: tell the API we want JSON format (not XML, HTML, etc.)
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
  },
};

// =======================
// 🔹 Our Main Component
// =======================

// App = the main component (like the root of our app)
const App = () => {
  // =======================
  // 🔹 State variables (React memory)
  // =======================

  // searchTerm = what user typed in search box (the notepad)
  // setSearchTerm = function (the pen) to update the notepad
  // default value = empty string ""
  const [searchTerm, setSearchTerm] = useState('');

  // movies = list of movies we fetch from API
  // setMovies = function to update that list
  // default = empty array [] (no movies at start)
  const [movies, setMovies] = useState([]);

  // errorMessage = if something goes wrong, we save the message here
  // setErrorMessage = update function
  // default = "" (no error at start)
  const [errorMessage, setErrorMessage] = useState('');

  // =======================
  // 🔹 Function to fetch movies
  // =======================

  // async = means we can use "await" inside (wait for fetch to finish)
  const fetchMovies = async () => {
    try {
      // endpoint = the exact API URL we will call
      // /discover/movie?sort_by=popularity.desc → sort movies by popularity
      // &api_key=${API_KEY} → add your personal key to unlock the API
      const endpoint = `${API_BASE_URL}/discover/movie?sor_by=popularity.desc&api_key=${API_KEY}`;

      // fetch() = function to call API
      // API_OPTIONS = we defined above (GET + headers)
      // await = wait for API response to come back
      const response = await fetch(endpoint, API_OPTIONS);

      // If API gives a bad response (not 200 OK), throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      // Convert the raw response into JSON (JavaScript object)
      const data = await response.json();
      console.log(data)

      // data.results = list of movies from TMDB
      // // Save them into "movies" state (so React re-renders with movies)
      // setMovies(data.results);

      // // Reset error message (if last time it failed, now it's fine)
      // setErrorMessage('');
      if(data.Response=="False"){
        setErrorMessage(data.Error ||"Failed to fetch movies")
      }
    } catch (error) {
      // If something breaks (like no internet), show error in console
      console.error(`Error fetching movies: ${error}`);

      // Also save error message into state → user will see it
      setErrorMessage('Could not load movies. Try again later.');
    }
  };

  // =======================
  // 🔹 useEffect (side effect hook)
  // =======================

  // useEffect runs code automatically when the component loads
  // [] = empty array → means "run once at the beginning only"
  useEffect(() => {
    fetchMovies(); // call our function when app starts
  }, []);

  // =======================
  // 🔹 Return JSX (UI of our app)
  // =======================
  return (
    <main>
      {/* background pattern (just styling) */}
      <div className="pattern" />

      {/* wrapper = container for the page */}
      <div className="wrapper">

        {/* HEADER */}
        <header>
          {/* Hero image (banner at the top) */}
          <img src="./hero.png" alt="Hero Banner" />

          {/* Main heading of the page */}
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle
          </h1>

          {/* Search bar component
              - We give it "searchTerm" (what’s in the notepad)
              - And "setSearchTerm" (the pen to update the notepad) */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* MOVIES SECTION */}
        <section>
          {/* Sub-heading */}
          <h2 className="all-movies">All Movies</h2>

          {/* If there's an error message, show it in red text */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Show movies if they exist */}
          <ul>
            {/* Loop through movies array
                - movie = current movie object
                - movie.id = unique key (React needs this)
                - movie.title = the movie name */}
            {movies.map((movie) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        </section>

        {/*
          🔹 Bro Summary of Hooks:
          - useState = notepad + pen (memory for values)
          - searchTerm = what you typed
          - setSearchTerm = pen to change it
          - movies = list of movies from API
          - errorMessage = what to show if fetch fails
          - useEffect = runs code when app loads (fetch movies)
        */}
      </div>
    </main>
  );
};

// Finally export App so React can use it
export default App;
