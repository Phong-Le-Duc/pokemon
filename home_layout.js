

let divElm = document.createElement("div")
divElm.id = "root"

divElm.innerHTML = `
<header>

    <img class="poke_ball" src="img/pokeball.png" alt="">
<span class="brand ">Pokédex</span> <br>
<form action="detail.html"></form>
<input class="poke_search" type="search" placeholder="Search Pokémon" name="name" id="name" />

</header>
<main></main>
<footer>By Phong Le Duc</footer>
`

document.querySelector("body").append(divElm)

let goTopBarElm = document.createElement("button")
goTopBarElm.className = "go-top-bar"
goTopBarElm.type = "button"
goTopBarElm.textContent = "Go to top"
document.querySelector("body").append(goTopBarElm)

function toggleGoTopBar() {
    if (window.scrollY > 400) {
        goTopBarElm.classList.add("is-visible")
    } else {
        goTopBarElm.classList.remove("is-visible")
    }
}

goTopBarElm.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" })
})

window.addEventListener("scroll", toggleGoTopBar)
toggleGoTopBar()







// ----------------- BEDRE UDGAVE---------------

/**
 * Extract id as string from url to pokemon
 * @param {string} pokemonUrl - a url to a pokemon from pokeApi 
 * @returns {string}
 */
function getIdFromPokemon(pokemonUrl) {
    return pokemonUrl.slice(0, -1).split("/").pop()
}

// const artworkUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

// INFINITE SCROLL
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            //noget her!

            currentOffset = currentOffset + 50

            if (currentOffset < 1304) {
                fetchPokemon(currentOffset)
            } else {
                console.log("no more pokemon");

            }

        }
    })
})
// --------------INFINITE SCROLL END--------------


// --------------HARDCODED LAZY LOAD------------------
// const imgObserver = new IntersectionObserver(function (entries) {
//     entries.forEach(function (entry) {
//         if (entry.isIntersecting) {
//             entry.target.src = entry.target.dataset.imagesrc
//             imgObserver.unobserve(entry.target)
//         }
//     })
// })





// her begynder selve komponentet
let sectionElm = document.createElement("section")
sectionElm.className = "pokelist"
let searchInputElm = document.querySelector("#name")

let allPokemon = []
let activeSearch = ""
let observedPokemonElm = null

let currentOffset = 0

function renderPokemonList() {
    let filteredPokemon = allPokemon.filter(function (pokemon) {
        if (!activeSearch) {
            return true
        }

        let pokemonName = pokemon.name.toLowerCase()
        let pokemonId = getIdFromPokemon(pokemon.url)
        let paddedPokemonId = padNumber(pokemonId)

        if (/^\d+$/.test(activeSearch)) {
            let searchHasLeadingZero = activeSearch.length > 1 && activeSearch.startsWith("0")
            if (searchHasLeadingZero) {
                return paddedPokemonId.startsWith(activeSearch)
            }

            return pokemonId.startsWith(activeSearch) || paddedPokemonId.startsWith(activeSearch)
        }

        return pokemonName.includes(activeSearch)
    })

    if (filteredPokemon.length === 0) {
        sectionElm.innerHTML = "<p>No Pokemon found.</p>"
    } else {
        sectionElm.innerHTML = filteredPokemon.map(function (pokemon) {
            return createPokeCard(pokemon)
        }).join("")
    }

    if (observedPokemonElm) {
        observer.unobserve(observedPokemonElm)
    }

    observedPokemonElm = sectionElm.querySelector("article:nth-last-child(5)")
    if (observedPokemonElm && !activeSearch) {
        observer.observe(observedPokemonElm)
    }
}

function fetchPokemon(offset) {

    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=50`)
        .then(function (response) {
            return response.json()
        }).then(
            function (data) {
                allPokemon = allPokemon.concat(data.results)
                renderPokemonList()


                // --------OBSERVER TIL HARDCODED LAZY LOAD
                // let observedImgs = sectionElm.querySelectorAll(".poke_image")
                // console.log(observedImgs);
                // observedImgs.forEach(function (observedImg) {
                //     imgObserver.observe(observedImg)
                // })


            }
        )
        .catch(function (error) {
            console.error(error)
        })

}

searchInputElm.addEventListener("input", function (event) {
    activeSearch = event.target.value.trim().toLowerCase()
    renderPokemonList()
})

document.querySelector("main").append(sectionElm)




fetchPokemon(currentOffset)


