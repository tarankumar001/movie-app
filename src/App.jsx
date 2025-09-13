import React, { useState } from 'react';
import Search from './components/search'; // Capital S

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
// Get → user types → event.target.value grabs the text.

// Save → setSearchTerm(...) saves it into React’s state (the notepad).

// Show → searchTerm renders that saved value back into the input (and anywhere else you use it).

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle
          </h1>
        </header>

        {/* Use the Search component correctly */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* 
          useState = a notepad + pen.
          searchTerm = what's written in the notepad.
          setSearchTerm = the pen to change it.
          Input box just shows what's on the notepad.
          
        */}
      </div>
    </main>
  );
};

export default App;
