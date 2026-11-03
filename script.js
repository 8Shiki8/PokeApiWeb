const pokemonGrid = document.getElementById("pokemon-grid");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const themeBtn = document.getElementById("theme-btn");
const typesContainer = document.getElementById("types-container");
const clearFiltersBtn = document.getElementById("clear-filters");

let allPokemon = [];
let selectedTypes = new Set();

const pokemonTypes = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

const typeColors = {
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
};

// Inicializar tema desde localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeBtn.querySelector(".theme-icon").textContent = "☀️";
  }
}

// Cambiar tema
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDarkTheme = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeBtn.querySelector(".theme-icon").textContent = isDarkTheme ? "☀️" : "🌙";
});

// Crear botones de filtro por tipo
function createTypeFilters() {
  typesContainer.innerHTML = "";
  pokemonTypes.forEach((type) => {
    const btn = document.createElement("button");
    btn.className = "type-filter-btn";
    btn.type = "button";
    btn.textContent = type;
    btn.style.borderColor = typeColors[type];
    btn.dataset.type = type;

    if (selectedTypes.has(type)) {
      btn.classList.add("active");
      btn.style.background = typeColors[type];
    } else {
      btn.style.background = "rgba(255, 255, 255, 0.1)";
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
        btn.classList.remove("active");
        btn.style.background = "rgba(255, 255, 255, 0.1)";
      } else {
        selectedTypes.add(type);
        btn.classList.add("active");
        btn.style.background = typeColors[type];
      }
      filterPokemon();
      updateClearButton();
    });

    typesContainer.appendChild(btn);
  });
}

// Actualizar estado del botón limpiar
function updateClearButton() {
  clearFiltersBtn.disabled = selectedTypes.size === 0;
}

// Limpiar filtros
clearFiltersBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectedTypes.clear();
  createTypeFilters();
  filterPokemon();
  updateClearButton();
});

// Filtrar Pokémon por tipos seleccionados
function filterPokemon() {
  if (selectedTypes.size === 0) {
    displayPokemonCards(allPokemon);
    return;
  }

  const filtered = allPokemon.filter((pokemon) => {
    const pokemonTypes = pokemon.types.map((t) => t.type.name);
    return Array.from(selectedTypes).every((selectedType) =>
      pokemonTypes.includes(selectedType),
    );
  });

  displayPokemonCards(filtered);
}

async function fetchPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    if (!response.ok) {
      throw new Error("Error al cargar los datos de la API");
    }
    const data = await response.json();
    displayPokemon(data.results);
  } catch (error) {
    console.error("Error:", error);
    loading.style.display = "none";
    errorDiv.textContent =
      "Error al cargar los Pokémon. Por favor, intenta de nuevo más tarde.";
    errorDiv.style.display = "block";
  }
}

async function getPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
}

function displayPokemon(pokemonList) {
  loading.style.display = "none";
  const loadingPromises = pokemonList.map(async (pokemon) => {
    return await getPokemonDetails(pokemon.url);
  });

  Promise.all(loadingPromises).then((details) => {
    allPokemon = details.filter((d) => d !== null);
    createTypeFilters();
    updateClearButton();
    displayPokemonCards(allPokemon);
  });
}

function displayPokemonCards(pokemonList) {
  pokemonGrid.innerHTML = "";

  if (pokemonList.length === 0) {
    pokemonGrid.innerHTML =
      '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-primary);">No se encontraron Pokémon con esos tipos</div>';
    return;
  }

  pokemonList.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    pokemonGrid.appendChild(card);
  });
}

function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";

  const imageUrl =
    pokemon.sprites.front_default ||
    "https://via.placeholder.com/200x200?text=No+Image";

  const shinyImageUrl =
    pokemon.sprites.front_shiny ||
    "https://via.placeholder.com/200x200?text=No+Shiny";

  const cryUrl = pokemon.cries?.legacy || pokemon.cries?.latest;

  const typesHtml = pokemon.types
    .map(
      (type) =>
        `<span class="type-badge ${type.type.name}">${type.type.name}</span>`,
    )
    .join("");

  const pokemonId = String(pokemon.id).padStart(3, "0");

  card.innerHTML = `
        <div class="pokemon-number">#${pokemonId}</div>
        <div class="pokemon-image-container">
            <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image" loading="lazy" id="img-${pokemon.id}">
            <div class="card-controls">
                ${
                  cryUrl
                    ? `<button class="control-btn cry-btn" data-cry="${cryUrl}" title="Reproducir grito">
                    <span class="btn-icon">🔊</span>
                    <span class="btn-text">Grito</span>
                </button>`
                    : ""
                }
                <button class="control-btn shiny-btn" data-normal="${imageUrl}" data-shiny="${shinyImageUrl}" title="Cambiar a Shiny">
                    <span class="btn-icon">✨</span>
                    <span class="btn-text">Shiny</span>
                </button>
            </div>
        </div>
        <div class="pokemon-info">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-types">${typesHtml}</div>
        </div>
    `;

  // Agregar event listeners después de crear el HTML
  const cryBtn = card.querySelector(".cry-btn");
  const shinyBtn = card.querySelector(".shiny-btn");
  const pokemonImg = card.querySelector(".pokemon-image");

  if (cryBtn) {
    cryBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playCry(cryBtn.dataset.cry);
    });
  }

  if (shinyBtn) {
    shinyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleShiny(shinyBtn, pokemonImg);
    });
  }

  return card;
}

// Función para reproducir el grito del Pokémon
function playCry(cryUrl) {
  const audio = new Audio(cryUrl);
  audio.volume = 0.3; // Volumen bajo para no ser molesto
  audio.play().catch((e) => {
    console.log("Error reproduciendo audio:", e);
  });
}

// Función para alternar entre sprite normal y shiny
function toggleShiny(button, image) {
  const isShiny = button.classList.contains("active");
  const btnText = button.querySelector(".btn-text");

  if (isShiny) {
    // Cambiar a normal
    image.style.opacity = "0";
    setTimeout(() => {
      image.src = button.dataset.normal;
      image.style.opacity = "1";
    }, 150);
    button.classList.remove("active");
    button.title = "Cambiar a Shiny";
    if (btnText) btnText.textContent = "Shiny";
  } else {
    // Cambiar a shiny
    image.style.opacity = "0";
    setTimeout(() => {
      image.src = button.dataset.shiny;
      image.style.opacity = "1";
    }, 150);
    button.classList.add("active");
    button.title = "Cambiar a Normal";
    if (btnText) btnText.textContent = "Normal";
  }
}

// Iniciar la aplicación
initTheme();
fetchPokemon();
