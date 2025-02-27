
// ----------------- BEDRE UDGAVE---------------


let divElm = document.createElement("div")
divElm.id = "root"

divElm.innerHTML = `
<header>
    <img class="poke_ball" src="img/pokeball.png" alt="">
<span class="brand ">Pokédex</span> <br>
<input class="poke_search" type="text" placeholder="Search" id=""/>
</header>
<main></main>
<footer>created 2025</footer>
`

document.querySelector("body").append(divElm)







/**
 * Extract id as string from url to pokemon
 * @param {string} pokemonUrl - a url to a pokemon from pokeApi 
 * @returns {string}
 */
function getIdFromPokemon(pokemonUrl) {
    return pokemonUrl.slice(0, -1).split("/").pop()
}

const artworkUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"


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


// her begynder selve komponentet
let sectionElm = document.createElement("section")
sectionElm.className = "pokelist"

let currentOffset = 0

function fetchPokemon(offset) {

    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=50`)
        .then(function (response) {
            return response.json()
        }).then(
            function (data) {
                sectionElm.innerHTML += data.results.map(pokemon => `
        <article class="poke__card">
              <p>#${getIdFromPokemon(pokemon.url).padStart(4, "0")}</p>
               
              <figure>
                <img class="poke_image" src="${artworkUrl}/${getIdFromPokemon(pokemon.url)}.png" alt="${pokemon.name}">
             </figure>
              
             <h2 class="poke__name">${pokemon.name}</h2>
              
             <a class="poke__link" href="/detail.html?name=${pokemon.name}"></a>            
         </article>
            `).join("")


                let observedPokemon = sectionElm.querySelector("article:nth-last-child(5)")
                observer.observe(observedPokemon)

            }
        )

    document.querySelector("main").append(sectionElm)

}

fetchPokemon(currentOffset)