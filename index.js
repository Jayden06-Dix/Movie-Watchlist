// Importing Functions from Shared.js File
import { getWatchlist, saveWatchlist, toggleWatchlist, isInWatchlist, updateButton, createMovieCard } from "./shared.js"

// Variables
const searchInput = document.getElementById("search-input")
const searchForm = document.querySelector(".search")
const results = document.getElementById("results")
const API_KEY = "2d489a67"

// Fetch Movies to be displayed.
async function fetchMovies(query) {
    results.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "False") {
            results.innerHTML = `<p>No results found.</p>`;
            return;
        }

        // Get the full details for each movie in the list
        const movies = await Promise.all(
            data.Search.map(async (item) => {
                const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`);
                return detailResponse.json();
            })
        );

        showMovies(movies);

    } catch (error) {
        console.error("Could not fetch data:", error);
        results.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}


// Event Listener for Search button, Call API with Query to search for movies.
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    // Prevent empty searches
    if(!query) {
        results.innerHTML = `<p>Please enter a search term</p>`;
        return;
    }

    // Call fetchMovies Function
    await fetchMovies(query);
});

// Function to Show Movies in HTML. 
function showMovies(data) {
    results.classList.remove("default-state")
    results.innerHTML = ''

    if (!data || data.length === 0) {
        results.innerHTML = `<p>No results found.</p>`
        return
    }

    data.forEach(movie => {
        results.appendChild(createMovieCard(movie))
    })
}

