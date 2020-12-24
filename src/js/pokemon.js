import { capitalize, getTypesString } from './helper.js';

async function fetchAllPokemons() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000'
  );
  const data = await response.json();
  return data.results;
}

async function fetchPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await response.json();
}

function createMiniCard(pokemon, app) {
  const article = document.createElement('ARTICLE');
  article.classList.add('pokemon-card', 'pokemon-card--mini');
  article.innerHTML = `
    <span class="pokemon-card__title" href="#">
      #${pokemon.id} ${pokemon.name}
    </span>
    <a class="pokemon-card__button" href="#">View</a>
  `;

  const showLink = article.querySelector('.pokemon-card__button');

  showLink.addEventListener('click', async (event) => {
    event.preventDefault();
    app.wrapper.classList.remove('wrapper--grid');
    app.wrapper.innerHTML = 'LOADING...';
    const pokemonData = await fetchPokemon(pokemon.id);
    const fullCard = createFullCard(pokemonData, app);
    app.wrapper.innerHTML = '';
    app.wrapper.appendChild(fullCard);
  });

  return article;
}

function createFullCard(pokemonData, app) {
  const pokemon = app.pokemons.find((pokemon) => pokemon.id === pokemonData.id);
  const article = document.createElement('ARTICLE');

  article.classList.add('pokemon-card', 'pokemon-card--full');
  article.innerHTML = `
    <h1 class="pokemon-card__title" href="#">
      #${pokemonData.id} ${capitalize(pokemonData.name)}
    </h1>

    <section class="pokemon-card__basic-data">
      <figure class="pokemon-card__figure">
        <img
          class="pokemon-card__image"
          src="${pokemonData.sprites.front_default}"
        >
      </figure>
      <ul class="pokemon-card__metadata">
        <li>Types: <strong>${getTypesString(pokemonData.types)}</strong></li>
        <li>Weight: <strong>${pokemonData.weight / 10} kg</strong></li>
        <li>Height: <strong>${pokemonData.height / 10} m</strong></li>
      </ul>
    </section>

    <section class="pokemon-card__stats">
      ${pokemonData.stats
        .map(
          (stat) =>
            `
        <div class="pokemon-card__stats-row">
          <div class="pokemon-card__stats-name">${stat.stat.name.toUpperCase()}</div>
          <div class="pokemon-card__stats-value" style="width: ${
            stat.base_stat
          }px">
            ${stat.base_stat}
          </div>
        </div>
        `
        )
        .join('')}
    </section>

    ${
      !pokemon.isCatched
        ? '<a class="pokemon-card__button" href="#">Catch!</a>'
        : ''
    }
  `;

  const catchButton = article.querySelector('.pokemon-card__button');

  if (catchButton) {
    catchButton.addEventListener('click', (event) => {
      event.preventDefault();
      pokemon.isCatched = true;
      app.savePokemons();
      article.removeChild(catchButton);
    });
  }

  return article;
}

function createRegularCard(pokemonData, app) {
  const catchedPokemon = app.pokemons.find(
    (pokemon) => pokemon.id === pokemonData.id
  );
  const article = document.createElement('article');
  article.classList.add('pokemon-card', 'pokemon-card--regular');

  article.innerHTML = `
    <a class="pokemon-card__title" href="#">
      #${pokemonData.id} ${capitalize(pokemonData.name)}
    </a>

    <a class="pokemon-card__figure" href="#">
      <img
        class="pokemon-card__image"
        src="${pokemonData.sprites.front_default}"
      >
    </a>

    <div class="pokemon-card__metadata">
      <strong>${getTypesString(pokemonData.types)}</strong>
    </div>

    <a class="pokemon-card__button" href="#">Release</a>
  `;

  const titleLink = article.querySelector('.pokemon-card__title');
  const figureLink = article.querySelector('.pokemon-card__figure');
  const releaseButton = article.querySelector('.pokemon-card__button');

  titleLink.addEventListener('click', (event) => {
    event.preventDefault();
    app.showPokemon(pokemonData);
  });

  figureLink.addEventListener('click', (event) => {
    event.preventDefault();
    app.showPokemon(pokemonData);
  });

  releaseButton.addEventListener('click', (event) => {
    event.preventDefault();
    catchedPokemon.isCatched = false;
    app.savePokemons();
    article.remove();
  });

  return article;
}

export {
  fetchAllPokemons,
  fetchPokemon,
  createMiniCard,
  createFullCard,
  createRegularCard,
};
