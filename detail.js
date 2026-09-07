



let search = window.location.search
let params = new URLSearchParams(search)
let pokeName = params.get("name")

if (!pokeName && window.location.hash.startsWith("#name=")) {
    pokeName = window.location.hash.slice(6)
}

if (pokeName) {
    pokeName = decodeURIComponent(pokeName)
}

console.log(pokeName);


let sectionElm = document.createElement("section")
sectionElm.className = "poke-detail"

function formatWeight(weightInHectograms) {
    return (weightInHectograms / 10).toFixed(1)
}

function formatHeight(heightInDecimeters) {
    return (heightInDecimeters / 10).toFixed(1)
}

function formatMoveName(moveName) {
    return moveName
        .split("-")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(" ")
}

function formatStatName(statName) {
    return statName
        .split("-")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(" ")
}

function hexToRgba(hexColor, alpha) {
    let hex = hexColor.replace("#", "").trim()

    if (hex.length === 3) {
        hex = hex.split("").map(function (char) {
            return char + char
        }).join("")
    }

    if (hex.length !== 6) {
        return `rgba(255, 255, 255, ${alpha})`
    }

    let r = parseInt(hex.slice(0, 2), 16)
    let g = parseInt(hex.slice(2, 4), 16)
    let b = parseInt(hex.slice(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getTypeColorWithAlpha(typeName, alpha) {
    let cssTypeColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`--color-${typeName}`)
        .trim()

    return hexToRgba(cssTypeColor, alpha)
}

if (!pokeName) {
    sectionElm.innerHTML = `<p>Pokemon not found in URL. Go back and choose one from the list.</p>`
    document.querySelector("main").append(sectionElm)
} else {
    fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokeName)}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Pokemon request failed with status ${response.status}`)
            }

            let contentType = response.headers.get("content-type") || ""
            if (!contentType.includes("application/json")) {
                throw new Error("Expected JSON response but received another content type")
            }

            return response.json()
        }).then(
            function (pokemon) {
                console.log(pokemon);


                let headerElm = document.querySelector("header")
                headerElm.className = "header-detail"
                headerElm.innerHTML = `
<div class="name-id">
<a class="name-id__back-link" href="javascript:history.back()"><img class="name-id__back-icon" src="/img/back_arrow.png" alt="Back"></a>
    <p class="name-id__pokemon">${pokemon.name}</p>
    <p class="pad-number">#${padNumber(pokemon.id)}</p>
    </div>
`
                // document.querySelector("header").append(sectionElm)

                document.querySelector("body").style.backgroundColor = `var(--color-${pokemon.types[0].type.name})`;


                sectionElm.innerHTML = `
         
         <!-- <div class="name-id">
          <p>${pokemon.name}</p>
           <p>#${pokemon.id.toString().padStart(4, "0")}</p>
           </div> -->

           <img class="poke_detail_image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">

           
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
        <section class="poke__info-card">
        <p class="poke__info-title">Weight</p>
        <p class="poke__info-value"><img class="poke__image-detail" src="img/weight.png" alt=""> ${formatWeight(pokemon.weight)} kg</p>
            </section>

        <section class="poke__info-card">
        <p class="poke__info-title">Height</p>
        <p class="poke__info-value"><img class="poke__image-detail" src="img/straighten.png" alt=""> ${formatHeight(pokemon.height)} m</p>
            </section>

<section class="poke__info-card">
        <p class="poke__info-title">Moves</p>
        <div class="poke__moves">
${pokemon.moves.slice(0, 2).map(function (singleMove) {
                    return `
    <p class="poke__move-item">${formatMoveName(singleMove.move.name)}</p>
    `
                }
                ).join("")}
        </div>
</section>

</div>

<h3>Base Stats</h3>

<table class="stats-table">
    ${pokemon.stats.map(function (singleStat) {
                    return `
     <tr class="stats-row">
     <th class="stats-name">${formatStatName(singleStat.stat.name)}</th>
    <td class="stats-value">${singleStat.base_stat}</td>
        <td class="progbar"><meter class="stats-meter meter--${pokemon.types[0].type.name}" max="250" value="${singleStat.base_stat}"></meter></td>
    </tr>
    `
                }
                ).join("")}
</table>

            `

                sectionElm.querySelectorAll("th").forEach(function (headingColor) {
                    headingColor.style.color = `var(--color-${pokemon.types[0].type.name})`
                })

                //  sectionElm.querySelector("meter").forEach(function(meterBarColor) {
                //     meterBarColor.style.backgroundColor = `var(--color-${pokemon.types[0].type.name})`
                // })


                sectionElm.querySelectorAll("h3").forEach(function (headingColor) {
                    headingColor.style.color = `var(--color-${pokemon.types[0].type.name})`
                })

                let cardBgColor = getTypeColorWithAlpha(pokemon.types[0].type.name, 0.25)
                let cardBorderColor = getTypeColorWithAlpha(pokemon.types[0].type.name, 0.55)

                sectionElm.querySelectorAll(".poke__info-card").forEach(function (cardElm) {
                    cardElm.style.backgroundColor = cardBgColor
                    cardElm.style.border = `1px solid ${cardBorderColor}`
                })

                document.querySelector("main").append(sectionElm)
            })
        .catch(function (error) {
            console.error(error)
            sectionElm.innerHTML = `<p>Could not load Pokemon data. Please try again.</p>`
            document.querySelector("main").append(sectionElm)
        })
}

