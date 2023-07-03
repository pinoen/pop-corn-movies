import { useEffect, useRef, useState } from "react";
import Stars from "./Stars";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = '1b786a86';

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  const { movies, error, isLoading } = useMovies(query)
  const [watched, setWatched] = useLocalStorageState([], 'watched')

  const handleSelectedMovie = (id) => {
    setSelectedId(curr => curr === id ? null : id)
  }

  const handleClose = () => {
    setSelectedId(null)
  }

  const handleDeleteWatched = (id) => {
    setWatched(curr => curr.filter(movie => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumberOfResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} handleSelectedMovie={handleSelectedMovie} />}
          {error && <Error message={error} />}
        </Box>

        <Box>
          {selectedId ? <MovieDetails selectedId={selectedId} handleClose={handleClose} watched={watched} setWatched={setWatched} /> :
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} handleDeleteWatched={handleDeleteWatched} />
            </>}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return (
    <p className="loader">Loading...</p>
  )
}

const Error = ({ message }) => {
  return (
    <p className="error"><span>⛔️ {message}</span></p>
  )
}

const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null)

  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus()
    setQuery('')
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

const NumberOfResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

const Main = ({ children }) => {
  return (
    <main className="main">
      {children}
    </main>
  )
}

const Box = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  )
}

const MovieList = ({ movies, handleSelectedMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} handleSelectedMovie={handleSelectedMovie} />
      ))}
    </ul>
  )
}

const MovieDetails = ({ selectedId, handleClose, setWatched, watched }) => {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const isRated = watched.some(movie => movie.imdbID === selectedId)
  const currentRating = watched.filter(movie => movie.imdbID === selectedId)[0]?.userRating
  const countRef = useRef(0)

  useKey('Escape', handleClose)

  useEffect(() => {
    if (userRating) {
      countRef.current++
    }
  }, [userRating])

  const handleAddWatched = (movie) => {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current
    }

    setWatched(curr => [...curr, newWatchedMovie])
    handleClose()
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(curr => !curr)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`)
      const data = await res.json()
      setMovie(data)
      setIsLoading(curr => !curr)
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(() => {
    if (!movie.Title) return;
    document.title = `Movie | ${movie.Title}`
    return () => document.title = 'usePopCorn 🎬️'
  }, [movie.Title])

  return (
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <header>
            <button onClick={handleClose} className="btn-back">⬅</button>
            <img src={movie.Poster} alt={`Porter of ${movie.Title}`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>{movie.Released} - {movie.Runtime}</p>
              <p>{movie.Genre}</p>
              <p><span>⭐️ {movie.imdbRating} IMDb rating</span></p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isRated ? <>
                <Stars numStars={10} onSetRating={setUserRating} />
                {userRating > 0 && <button className="btn-add" onClick={() => handleAddWatched(movie)}>+ Add to the list</button>}
              </> :
                <p>You already rated this movie with {currentRating} <span>⭐️</span></p>
              }
            </div>
            <p><em>{movie.Plot}</em></p>
            <p>Starring: {movie.Actors}</p>
            <p>Directed by: {movie.Director}</p>
          </section>
        </>}
    </div>
  )
}

const Movie = ({ movie, handleSelectedMovie }) => {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

const Summary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  )
}

const WatchedMovieList = ({ watched, handleDeleteWatched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} handleDeleteWatched={handleDeleteWatched} />
      ))}
    </ul>
  )
}

const WatchedMovie = ({ movie, handleDeleteWatched }) => {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button onClick={() => handleDeleteWatched(movie.imdbID)} className="btn-delete">X</button>
      </div>
    </li>
  )
}