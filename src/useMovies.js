import { useEffect, useState } from "react";
const API_KEY = '1b786a86';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(curr => !curr)
        setError('')
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, { signal: controller.signal })
        if (!res.ok) {
          throw new Error("Something went wrong when fetching movies!")
        }

        const data = await res.json()
        if (data.Response === "False") {
          throw new Error("Movie not found!")
        }
        setMovies(data.Search)
        setError('')

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(curr => !curr)
      }

      if (query.length < 3) {
        setMovies([])
        setError('')
        return
      }
    }
    // handleClose()
    fetchMovies()

    return () => controller.abort()
  }, [query])

  return { movies, error, isLoading }
}