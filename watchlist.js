// Importing Functions from Shared.js File
import { getWatchlist, saveWatchlist, toggleWatchlist, isInWatchlist, updateButton, createMovieCard } from "./shared.js"

// Variables 
const emptyState = document.getElementById("empty-state")
const watchlistResults = document.getElementById("watchlist-results")

// Function to Render Watchlist on Watchlist page.
function renderWatchlist() {
    const  list = getWatchlist()

    watchlistResults.innerHTML = ''

    if(list.length === 0) {
        emptyState.classList.remove("hidden")
        return 
    } else {
        emptyState.classList.add("hidden")
        
        list.forEach(movie => {
            watchlistResults.appendChild(
                createMovieCard(movie, renderWatchlist)
            )
        })
    }
}

renderWatchlist()