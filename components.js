function createPokeCard(poke) {
  // console.log(poke);
  let pokeID = getIdFromPokemon(poke.url);
  return `
            <article class="poke__card">
                  <p>#${padNumber(getIdFromPokemon(poke.url))}</p>
                   
                  <figure>
                    <img class="poke_image" loading="lazy" src="${getImageForPokeID(pokeID)}" alt="${poke.name}">
                 </figure>
                  
                 <h2 class="poke__name">${poke.name}</h2>
                  
                   <a class="poke__link" href="./detail?name=${encodeURIComponent(poke.name)}"></a>            
             </article>`
}

function padNumber(number) {
  return number.toString().padStart(3, "0")
}

function getImageForPokeID(id) {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id + ".png"
}

console.log(getImageForPokeID(3))