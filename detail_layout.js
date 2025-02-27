


let divElm = document.createElement("div")
divElm.id = "root"

divElm.innerHTML = `
<header>

</header>
<main></main>
<footer>created 2025</footer>
`

document.querySelector("body").append(divElm)









let search = window.location.search
let params = new URLSearchParams(search)
let pokeName = params.get("name")

console.log(pokeName);


let sectionElm = document.createElement("section")
sectionElm.className = "poke-detail"

fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    .then(function (response) {
        return response.json()
    }).then(
        function (pokemon) {
            console.log(pokemon);


let headerElm = document.querySelector("header")
headerElm.innerHTML = `
    <p>${pokemon.name}</p>
    <p>#${pokemon.id.toString().padStart(4, "0")}</p>
`
// document.querySelector("header").append(sectionElm)
            
            document.querySelector("body").style.backgroundColor = `var(--color-${pokemon.types[0].type.name})`;


            sectionElm.innerHTML = `
         
         <div class="name-id">
          <p>${pokemon.name}</p>
           <p>#${pokemon.id.toString().padStart(4, "0")}</p>
           </div>

           <img class="poke_image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">

           
           <h3>About</h3>

 <div class="poke__type">
           ${pokemon.types.map(function (singleType) {
                return `
      <p class="${singleType.type.name}">${singleType.type.name}</p>
     `
            }
            ).join("")}
 </div>

         
<div class="poke__info">
            <section>
            <p><img class="poke__image-detail" src="img/weight.png" alt=""> ${pokemon.weight} kg</p>
            </section>

            <section>
            <p><img class="poke__image-detail" src="img/straighten.png" alt="">${pokemon.height} m</p>
            </section>

<section>
${pokemon.moves.slice(0, 2).map(function (singleMove) {
                return `
    <p>${singleMove.move.name}</p>
    `
            }
            ).join("")}
            <p>moves</p>
</section>

</div>

<h3>Base Stats</h3>

<table>
    ${pokemon.stats.map(function (singleStat) {
                return `
   <tr>
   <th>${singleStat.stat.name}</th>
  <td>${singleStat.base_stat}</td>
  <td class="progbar"><meter id="file" max="250" value="${singleStat.base_stat}"></td>
    </tr>
    `
            }
            ).join("")}
</table>

            `

 sectionElm.querySelectorAll("th").forEach(function(headingColor) {
    headingColor.style.color = `var(--color-${pokemon.types[0].type.name})`
})

//  sectionElm.querySelector("meter").forEach(function(meterBarColor) {
//     meterBarColor.style.backgroundColor = `var(--color-${pokemon.types[0].type.name})`
// })
                

            sectionElm.querySelectorAll("h3").forEach(function(headingColor) {
                headingColor.style.color = `var(--color-${pokemon.types[0].type.name})`
            })
            document.querySelector("main").append(sectionElm)
        })

