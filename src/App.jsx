import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10'); // Limiting to 10 for demonstration
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const allPokemon = data.results;

        const randomPokemon = [];
        const indices = new Set();
        while (indices.size < 10) {
          const randomIndex = Math.floor(Math.random() * allPokemon.length);
          if (!indices.has(randomIndex)) {
            indices.add(randomIndex);
            randomPokemon.push(allPokemon[randomIndex]);
          }
        }

        const pokemonData = await Promise.all(
          randomPokemon.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
              name: data.name,
              image: data.sprites.front_default,
              customAttribute: ''
            };
          })
        );

        setPokemonList(pokemonData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPokemon();
  }, []);

  function handleCardClick(name) {
    // Find the clicked pokemon by name
    const updatedPokemonList = pokemonList.map(pokemon => {
      if (pokemon.name === name && pokemon.customAttribute === '') {
        return { ...pokemon, customAttribute: 'clicked' };
      }
      if (pokemon.name === name && pokemon.customAttribute === 'clicked') {
        return { ...pokemon, customAttribute: 'clickedTwice' };
      }
      return pokemon;
    });

    // Check if any pokemon has 'customAttribute' equal to 'clickedTwice'
    const hasClickedTwicePokemon = updatedPokemonList.some(pokemon => pokemon.customAttribute === 'clickedTwice');

    // If any pokemon has 'customAttribute' equal to 'clickedTwice', reset the score
    if (hasClickedTwicePokemon) {
      setScore(0);
    } else {
      // Otherwise, increment the score
      setScore(prevScore => prevScore + 1);
    }

    // Update the state with the modified list
    setPokemonList(updatedPokemonList);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function shuffleAllAndHandleClick(name) {
    const shuffledArray = shuffle([...pokemonList]);
    const updatedShuffledArray = shuffledArray.map(pokemon => {
      if (pokemon.name === name && pokemon.customAttribute === '') {
        return { ...pokemon, customAttribute: 'clicked' };
      }
      if (pokemon.name === name && pokemon.customAttribute === 'clicked') {
        return { ...pokemon, customAttribute: 'clickedTwice' };
      }
      return pokemon;
    });

    setPokemonList(updatedShuffledArray);

    // Check if any pokemon has 'customAttribute' equal to 'clickedTwice'
    const hasClickedTwicePokemon = updatedShuffledArray.some(pokemon => pokemon.customAttribute === 'clickedTwice');

    // If any pokemon has 'customAttribute' equal to 'clickedTwice', reset the score
    if (hasClickedTwicePokemon) {
      setScore(0);
    } else {
      // Otherwise, increment the score
      setScore(prevScore => prevScore + 1);
    }
  }

  return (
    <>
      <div className="container">
        {pokemonList.map((pokemon, index) => (
          <div
            id={`pokemon-card-${pokemon.name}`}
            key={index}
            className="pokemon-card"
            onClick={() => shuffleAllAndHandleClick(pokemon.name)}
            data-custom-attribute={pokemon.customAttribute || ''}
          >
            <img src={pokemon.image} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
      <p>Score: {score}</p>
    </>
  );
}

export default App;
