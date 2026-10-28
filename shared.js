// WatchList Functions to Read, Add and Remove movies From the Watchlist 
export function getWatchlist() {
    const storedinWatchlist = localStorage.getItem("watchlist")

    if(storedinWatchlist === null) {
        return []
    }
     return JSON.parse(storedinWatchlist)
}

export function saveWatchlist(list) {
    localStorage.setItem("watchlist", JSON.stringify(list))
}

export function toggleWatchlist(movie) {
    const list = getWatchlist()
    const alreadySaved = list.some(item => item.imdbID === movie.imdbID)

    if(alreadySaved) {
        const newList = list.filter(item => item.imdbID !== movie.imdbID)
        saveWatchlist(newList)
    } else {
        list.push(movie)
        saveWatchlist(list)
    }
}

export function isInWatchlist(imdbID) {
    const list = getWatchlist()
    return list.some(item => item.imdbID === imdbID)
}

export function updateButton(button, saved) {
    const icon = button.querySelector("i")
    const text = button.querySelector(".watchlist-text")

    if (saved) {
        text.textContent = "Remove"
        icon.classList.replace("fa-circle-plus", "fa-circle-minus")
    } else {
        text.textContent = "Watchlist"
        icon.classList.replace("fa-circle-minus", "fa-circle-plus")
    }
}

// Function to add Movies to Watchlist Page if Selected. 

export function createMovieCard(movie, onChange) {
     const movieElement = document.createElement('div')
        movieElement.className = 'movie-result'

        // Work out what the plot area should contain
        let plotHTML

        if (movie.Plot.length > 120) {
            const plotShort = movie.Plot.slice(0, 120)

            plotHTML = `
                <span class="plot-short">${plotShort}...</span>
                <span class="plot-full hidden">${movie.Plot}</span>
                <button type="button" class="read-more">Read More</button>
            `
        } else {
            plotHTML = movie.Plot
        }

        // One template for every card
        movieElement.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" onerror="this.onerror=null; this.src='watchlist-header.png'">
            <div class="movie-info">
                <div class="title-container">
                    <p class="movie-title">${movie.Title}</p>
                    <p class="movie-rating"><i class="fa-solid fa-star"></i> ${movie.imdbRating}</p>
                </div>
                <div class="info-container">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <button type="button" class="watchlist-btn">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span class="watchlist-text">Watchlist</span>
                    </button>
                </div>
                <div>
                    <p class="movie-desc">${plotHTML}</p>
                </div>
            </div>
        `

        // Read More button (only exists on long plots)
        const readMoreBtn = movieElement.querySelector(".read-more")

        if (readMoreBtn) {
            const plotShortEl = movieElement.querySelector(".plot-short")
            const plotFullEl = movieElement.querySelector(".plot-full")

            readMoreBtn.addEventListener("click", () => {
                plotShortEl.classList.toggle("hidden")
                plotFullEl.classList.toggle("hidden")

                if (plotFullEl.classList.contains("hidden")) {
                    readMoreBtn.textContent = "Read More"
                } else {
                    readMoreBtn.textContent = "Read Less"
                }
            })
        }

        // Watchlist button
        const watchlistBtn = movieElement.querySelector(".watchlist-btn")

        //When the card appears, show the correct state
        updateButton(watchlistBtn, isInWatchlist(movie.imdbID))

        // When clicked, save or remove the movie and show the correct state
        watchlistBtn.addEventListener("click", () => {
            toggleWatchlist(movie)
            updateButton(watchlistBtn, isInWatchlist(movie.imdbID))

            if(onChange) {
                onChange()
            }
        })

        return movieElement
    }