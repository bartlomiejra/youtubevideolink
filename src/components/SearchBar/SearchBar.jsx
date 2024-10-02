// components/SearchBar.js
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSortNewest, handleSortRandom }) => {
  return (
    <>
   <h2 className="text-sm text-gray-400 text-align-center">
    Wybierz interesującą Cię platformę: 
    <span className="text-red-500"> YouTube, </span>
    <span className="text-green-500">Rumble</span>, 
    <span className="text-blue-500"> podcasty</span>. 
    Wpisz tytuł audiobooka, serię książek lub nazwisko autora, aby szybko znaleźć interesujące Cię pozycje w naszej kolekcji.
</h2>
    <div className="mb-4 p-4 flex items-center justify-center">
      {/* Pasek wyszukiwania */}
      <button
        onClick={handleSortNewest}
        className="ml-2 h-12 p-2 border border-gray-700 rounded flex items-center justify-center"
      >
        📅 Najnowsze
      </button>
      <input
        type="text"
        placeholder="Szukaj audiobooków..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-3/4 lg:w-2/3 h-12 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" // Dodano h-12
      />

      {/* Przyciski do sortowania */}
      <button
        onClick={handleSortRandom}
        className="ml-2 h-12 p-2 border border-gray-700 rounded flex items-center justify-center"
        >
        🎲 Losuj
      </button>
    </div>
  </>
  );
};

export default SearchBar;
