const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const FAVORITES_KEY = "recipefinder-favorites";
const MAX_RESULTS = 20;

const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const feedback = document.querySelector("#feedback");
const resultsContainer = document.querySelector("#results");
const favoritesList = document.querySelector("#favorites-list");
const favoritesCount = document.querySelector("#favorites-count");
const clearFavoritesButton = document.querySelector("#clear-favorites");
const detailPanel = document.querySelector("#detail-panel");
const detailContent = document.querySelector("#detail-content");
const closeDetailButton = document.querySelector("#close-detail");
const detailBackdrop = document.querySelector("#detail-backdrop");

let currentResults = [];
let favorites = loadFavorites();

renderFavorites();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    currentResults = [];
    renderResults();
    setFeedback("Geef eerst een trefwoord in.", "error");
    searchInput.focus();
    return;
  }

  await searchMeals(query);
});

resultsContainer.addEventListener("click", async (event) => {
  const detailButton = event.target.closest("[data-action='details']");
  const favoriteButton = event.target.closest("[data-action='favorite']");

  if (detailButton) {
    await openMealDetails(detailButton.dataset.id);
  }

  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.id);
  }
});

favoritesList.addEventListener("click", async (event) => {
  const detailButton = event.target.closest("[data-action='details']");
  const removeButton = event.target.closest("[data-action='remove']");

  if (detailButton) {
    await openMealDetails(detailButton.dataset.id);
  }

  if (removeButton) {
    removeFavorite(removeButton.dataset.id);
  }
});

clearFavoritesButton.addEventListener("click", () => {
  favorites = [];
  saveFavorites();
  renderFavorites();
  renderResults();
});

closeDetailButton.addEventListener("click", closeDetails);
detailBackdrop.addEventListener("click", closeDetails);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetails();
  }
});

async function searchMeals(query) {
  setFeedback("Recepten worden opgehaald...", "loading");
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error("De server gaf geen geldig antwoord.");
    }

    const data = await response.json();
    currentResults = Array.isArray(data.meals) ? data.meals.slice(0, MAX_RESULTS) : [];
    renderResults();

    if (currentResults.length === 0) {
      setFeedback(`Geen recepten gevonden voor "${query}".`, "error");
    } else {
      setFeedback(`${currentResults.length} recept(en) gevonden voor "${query}".`, "success");
    }
  } catch (error) {
    currentResults = [];
    renderResults();
    setFeedback("Het ophalen van recepten is mislukt. Controleer je verbinding en probeer opnieuw.", "error");
  }
}

function renderResults() {
  resultsContainer.innerHTML = "";

  currentResults.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const isFavorite = favorites.some((favorite) => favorite.idMeal === meal.idMeal);
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="recipe-content">
        <div>
          <h3>${meal.strMeal}</h3>
          <p class="recipe-meta">${meal.strCategory || "Onbekende categorie"} - ${meal.strArea || "Onbekende regio"}</p>
        </div>
        <div class="card-actions">
          <button class="primary-button" type="button" data-action="details" data-id="${meal.idMeal}">Details</button>
          <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-action="favorite" data-id="${meal.idMeal}" aria-label="${isFavorite ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}">${isFavorite ? "Favoriet" : "Bewaar"}</button>
        </div>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}

async function openMealDetails(id) {
  detailPanel.classList.remove("hidden");
  detailContent.innerHTML = `<div class="detail-hero"><p class="loading">Details worden geladen...</p></div>`;

  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("Details konden niet geladen worden.");
    }

    const data = await response.json();
    const meal = data.meals && data.meals[0];

    if (!meal) {
      throw new Error("Recept niet gevonden.");
    }

    renderDetails(meal);
  } catch (error) {
    detailContent.innerHTML = `<div class="detail-hero"><p class="error">De details konden niet opgehaald worden.</p></div>`;
  }
}

function renderDetails(meal) {
  const ingredients = getIngredients(meal);
  const isFavorite = favorites.some((favorite) => favorite.idMeal === meal.idMeal);

  detailContent.innerHTML = `
    <div class="detail-hero">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="detail-body">
        <div>
          <h2 id="detail-title">${meal.strMeal}</h2>
          <p class="detail-meta">${meal.strCategory || "Onbekende categorie"} - ${meal.strArea || "Onbekende regio"}</p>
        </div>
        <div class="tag-row">
          <span class="tag">${meal.strCategory || "Categorie"}</span>
          <span class="tag">${meal.strArea || "Regio"}</span>
          ${isFavorite ? `<span class="tag">Favoriet</span>` : ""}
        </div>
        <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" onclick="toggleFavorite('${meal.idMeal}')">${isFavorite ? "Verwijder favoriet" : "Voeg toe aan favorieten"}</button>
        <section>
          <h3>Ingredienten</h3>
          <ul class="ingredients">
            ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
          </ul>
        </section>
        <section>
          <h3>Instructies</h3>
          <p class="instructions">${meal.strInstructions || "Geen instructies beschikbaar."}</p>
        </section>
      </div>
    </div>
  `;
}

function getIngredients(meal) {
  const ingredients = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim());
    }
  }

  return ingredients;
}

function toggleFavorite(id) {
  const existingFavorite = favorites.find((favorite) => favorite.idMeal === id);

  if (existingFavorite) {
    favorites = favorites.filter((favorite) => favorite.idMeal !== id);
  } else {
    const meal = currentResults.find((result) => result.idMeal === id);

    if (meal) {
      addFavorite(meal);
    }
  }

  saveFavorites();
  renderFavorites();
  renderResults();
}

function addFavorite(meal) {
  favorites.push({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory,
    strArea: meal.strArea
  });
}

function removeFavorite(id) {
  favorites = favorites.filter((favorite) => favorite.idMeal !== id);
  saveFavorites();
  renderFavorites();
  renderResults();
}

function renderFavorites() {
  favoritesList.innerHTML = "";
  favoritesCount.textContent = `${favorites.length} bewaarde recept${favorites.length === 1 ? "" : "en"}`;
  clearFavoritesButton.disabled = favorites.length === 0;

  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="empty-state">Je hebt nog geen favorieten bewaard.</p>`;
    return;
  }

  favorites.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "favorite-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="favorite-info">
        <div>
          <h3>${meal.strMeal}</h3>
          <p class="favorite-meta">${meal.strCategory || "Categorie"} - ${meal.strArea || "Regio"}</p>
        </div>
        <div class="favorite-actions">
          <button class="primary-button" type="button" data-action="details" data-id="${meal.idMeal}">Details</button>
          <button class="remove-button" type="button" data-action="remove" data-id="${meal.idMeal}">Verwijder</button>
        </div>
      </div>
    `;
    favoritesList.appendChild(card);
  });
}

function setFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = `feedback ${type || ""}`.trim();
}

function closeDetails() {
  detailPanel.classList.add("hidden");
}

function loadFavorites() {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);

  if (!storedFavorites) {
    return [];
  }

  try {
    const parsedFavorites = JSON.parse(storedFavorites);
    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

