# Documentatie Recipefinder

## Initiele prompt

Maak een single page toepassing waarmee je recepten kan zoeken op basis van een trefwoord. Gebruik de gratis TheMealDB API. Toon de eerste zoekresultaten als receptkaarten met naam, afbeelding, categorie en regio. De gebruiker moet per recept details kunnen bekijken, recepten als favoriet kunnen bewaren, favorieten kunnen verwijderen en favorieten moeten persistent blijven na verversen of sluiten van de browser. Gebruik enkel HTML, CSS en JavaScript en documenteer het AI-gebruik.

## Door AI voorgesteld plan van aanpak

1. Projectstructuur maken met `index.html`, `css/style.css`, `js/script.js`, `AGENTS.md` en `documentatie.md`.
2. Basislayout bouwen met een zoekgedeelte, resultatenoverzicht, favorietenpaneel en detailvenster.
3. TheMealDB API aanspreken met `fetch` en `async/await`.
4. Resultaten beperken tot maximaal 20 recepten en renderen als kaarten.
5. Detailinformatie ophalen via de lookup endpoint en ingredienten automatisch uit de 20 mogelijke velden verzamelen.
6. Favorieten opslaan, laden en verwijderen via `localStorage`.
7. Feedback voorzien voor lege zoekopdrachten, geen resultaten en fouten bij het ophalen van data.
8. CSS responsive maken en de toepassing testen in de browser.

## Gebruikte agents en gespreksverloop

- ChatGPT/Codex werd gebruikt als programmeeragent om de opdracht te analyseren, een plan te maken en de bestanden te genereren.
- De opdracht werd aangeleverd via foto's van de examenbundel.
- De agent heeft de vereisten samengevat naar een functionele checklist en de toepassing opgebouwd volgens de toegelaten technieken: HTML, CSS en gewone JavaScript.
- Er zijn geen JavaScript-frameworks, Bootstrap of externe libraries gebruikt.

## Belangrijke implementatiekeuzes

- De zoekfunctie gebruikt `https://www.themealdb.com/api/json/v1/1/search.php?s=...`.
- De detailweergave gebruikt `https://www.themealdb.com/api/json/v1/1/lookup.php?i=...`.
- Favorieten worden bewaard onder de sleutel `recipefinder-favorites` in `localStorage`.
- De favorietenlijst staat naast de zoekresultaten op desktop en onder de resultaten op kleinere schermen.
- Het detailvenster is een modal zodat de gebruiker snel terug kan naar de resultaten.

## Testverslag

Te controleren functies:

- Lege zoekopdracht toont feedback.
- Zoekterm met resultaten, bijvoorbeeld `chicken`, toont receptkaarten.
- Zoekterm zonder resultaten toont duidelijke feedback.
- Details openen toont afbeelding, categorie, regio, instructies en ingredienten.
- Favoriet toevoegen verandert de knop visueel en voegt het recept toe aan de favorietenlijst.
- Favoriet verwijderen haalt het recept uit de lijst.
- Na verversen van de pagina blijven favorieten zichtbaar.
- Layout blijft bruikbaar op desktop en mobiel.
