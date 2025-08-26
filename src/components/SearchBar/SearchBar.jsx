import GenresBar from './GenresBar'; // Importujemy listę gatunków, jeśli jest potrzebna

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  handleSortNewest,
  handleSortRandom,
  setCurrentPage,  // Funkcja do ustawiania bieżącej strony
}) => {
  // Funkcja obsługująca zmianę tekstu w wyszukiwarce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetujemy stronę na 1 przy każdym wyszukiwaniu
  };

  // Funkcja do obsługi kliknięcia przycisku "Najnowsze"
  const handleNewestClick = () => {
    handleSortNewest();
    setCurrentPage(1); // Resetujemy stronę na 1 po kliknięciu przycisku
  };

  // Funkcja do obsługi kliknięcia przycisku "Losuj"
  const handleRandomClick = () => {
    handleSortRandom();
    setCurrentPage(1); // Resetujemy stronę na 1 po kliknięciu przycisku
  };
  return (
    <>
        <GenresBar/>
      <div className="mb-4 p-2 flex items-center justify-center">
        <div className="gatunki">
          
        </div>
        <button
          onClick={handleNewestClick} // Zmieniamy na handleNewestClick, by resetować stronę
          className="ml-2 h-12 p-2 border border-gray-700 rounded flex items-center justify-center"
        >
          📅 Najnowsze
        </button>
        <input
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          type="text"
          placeholder="Szukaj audiobooków..."
          className="w-full md:w-3/4 lg:w-2/3 h-12 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />

        {/* Przyciski do sortowania */}
        <button
          onClick={handleRandomClick} // Zmieniamy na handleRandomClick, by resetować stronę
          className="ml-2 h-12 p-2 border border-gray-700 rounded flex items-center justify-center"
        >
          🎲 Losuj
        </button>
      </div>
      <h2 className="text-m text-gray-400 text-align-center">
        Wybierz interesującą Cię platformę: 
        <span className="text-red-500"> YouTube, </span>
        <span className="text-green-500">Rumble</span>, 
        <span className="text-blue-500"> podcasty</span>. 
        Wpisz tytuł audiobooka, serię książek lub nazwisko autora, aby szybko znaleźć interesujące Cię pozycje w naszej kolekcji.
      </h2>

    </>
  );
};

export default SearchBar;
