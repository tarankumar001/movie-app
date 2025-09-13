import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}//event.target.value just means:
// 👉 “Grab the current text from the input box.”
// Then you pass that into setSearchTerm(...) to update React’s state.
        />
      </div>
    </div>
  );
};

export default Search;
