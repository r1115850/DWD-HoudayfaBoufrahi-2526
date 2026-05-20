
const API_KEY = "9NbKJCHr9lEqi4tnUWe3wStazIJ0lPd8DhQBvonb";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultsContainer = document.querySelector("#results");
const dashboardContainer = document.querySelector("#dashboard");
const message = document.querySelector("#message");

let dashboardSounds = [];
let currentAudio = null;
let currentButton = null;

function init() {
   loadDashboard();

   searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const keyword = searchInput.value.trim();

      if (keyword === "") {
         message.textContent = "Geef eerst een zoekwoord in.";
      } else {
         searchSounds(keyword);
      }
   });
}

function loadDashboard() {
   const savedSounds = localStorage.getItem("dashboardSounds");

   if (savedSounds !== null) {
      dashboardSounds = JSON.parse(savedSounds);
   }

   renderDashboard();
}

function saveDashboard() {
   localStorage.setItem("dashboardSounds", JSON.stringify(dashboardSounds));
}

async function searchSounds(keyword) {
   message.textContent = "Geluiden worden geladen...";
   resultsContainer.innerHTML = "";

   const url = `https://freesound.org/apiv2/search/text/?query=${keyword}&fields=id,name,duration,previews,images&token=${API_KEY}`;

   const response = await fetch(url);
   const data = await response.json();

   message.textContent = "";

   renderResults(data.results);
}

function renderResults(sounds) {
   resultsContainer.innerHTML = "";

   if (sounds.length === 0) {
      message.textContent = "Geen resultaten gevonden.";
   }

   sounds.forEach(function (sound) {
      const card = createSoundCard(sound, "result");
      resultsContainer.appendChild(card);
   });
}

function renderDashboard() {
   dashboardContainer.innerHTML = "";

   if (dashboardSounds.length === 0) {
      dashboardContainer.innerHTML = "<p>Je dashboard is nog leeg.</p>";
   }

   dashboardSounds.forEach(function (sound) {
      const card = createSoundCard(sound, "dashboard");
      dashboardContainer.appendChild(card);
   });
}

function createSoundCard(sound, type) {
   const card = document.createElement("article");
   card.classList.add("sound-card");

   const title = document.createElement("h3");
   title.textContent = sound.name;

   const image = document.createElement("img");

   if (sound.images && sound.images.waveform_m) {
      image.src = sound.images.waveform_m;
   } else {
      image.src = "";
      image.alt = "Geen waveform beschikbaar";
   }

   const duration = document.createElement("p");
   duration.textContent = `Duur: ${Math.round(sound.duration)} seconden`;

   const buttonRow = document.createElement("div");
   buttonRow.classList.add("button-row");

   const playButton = document.createElement("button");
   playButton.textContent = "Play";
   playButton.classList.add("play-button");

   playButton.addEventListener("click", function () {
      playOrStopSound(sound, playButton);
   });

   buttonRow.appendChild(playButton);

   if (type === "result") {
      const favoriteButton = document.createElement("button");
      favoriteButton.textContent = "Toevoegen";
      favoriteButton.classList.add("favorite-button");

      favoriteButton.addEventListener("click", function () {
         addToDashboard(sound);
      });

      buttonRow.appendChild(favoriteButton);
   }

   if (type === "dashboard") {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Verwijderen";
      deleteButton.classList.add("delete-button");

      deleteButton.addEventListener("click", function () {
         removeFromDashboard(sound.id);
      });

      buttonRow.appendChild(deleteButton);
   }

   card.appendChild(title);
   card.appendChild(image);
   card.appendChild(duration);
   card.appendChild(buttonRow);

   return card;
}

function playOrStopSound(sound, button) {
   const audioUrl = sound.previews["preview-hq-mp3"];

   if (currentAudio !== null && currentButton === button) {
      stopCurrentSound();
      return;
   }

   stopCurrentSound();

   currentAudio = new Audio(audioUrl);
   currentButton = button;

   button.classList.add("active");
   button.textContent = "Stop";

   currentAudio.play();

   currentAudio.addEventListener("ended", function () {
      stopCurrentSound();
   });
}

function stopCurrentSound() {
   if (currentAudio !== null) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
   }

   if (currentButton !== null) {
      currentButton.classList.remove("active");
      currentButton.textContent = "Play";
   }

   currentAudio = null;
   currentButton = null;
}

function addToDashboard(sound) {
   const alreadyExists = dashboardSounds.some(function (dashboardSound) {
      return dashboardSound.id === sound.id;
   });

   if (alreadyExists) {
      message.textContent = "Dit geluid staat al op je dashboard.";
   } else {
      dashboardSounds.push(sound);
      saveDashboard();
      renderDashboard();
      message.textContent = "Geluid toegevoegd aan dashboard.";
   }
}

function removeFromDashboard(id) {
   dashboardSounds = dashboardSounds.filter(function (sound) {
      return sound.id !== id;
   });

   saveDashboard();
   renderDashboard();
}

init();
