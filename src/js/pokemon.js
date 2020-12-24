import App from './app.js';
import { getTypesString } from './helper.js';

export default class Pokemon {
  constructor({ id, name, url, catched = false }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.catched = catched;
  }

  createMiniCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card', 'pokemon-card--mini');
    article.innerHTML = `
      <a class="pokemon-card__link" href="#">
        #${this.id} ${this.name}
      </a>
      ${(!this.catched) ? '<a class="pokemon-card__button" href="#">Catch!</a>' : '' }
    `;

    const showLink = article.querySelector('.pokemon-card__link');
    const catchButton = article.querySelector('.pokemon-card__button');

    showLink.addEventListener('click', (e) => {
      e.preventDefault();
      App._instance.clean();
      App._instance.wrapper.append(this.createFullCard());
    });

    if (catchButton) {
      catchButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.catched = true;
        App._instance.savePokemons();
        article.removeChild(catchButton);
      });
    }

    return article;
  }

  createRegularCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card', 'pokemon-card--regular');

    fetch(this.url)
      .then((res) => res.json())
      .then((pokemon) => {
        article.innerHTML = `
          <a class="pokemon-card__title" href="#">
            #${pokemon.id} ${pokemon.name}
          </a>

          <a class="pokemon-card__figure" href="#">
            <img class="pokemon-card__image" src="${pokemon.sprites.front_default}">
          </a>

          <ul class="pokemon-card__metadata">
            <li>Types: <strong>${getTypesString(pokemon.types)}</strong></li>
          </ul>

          <a class="pokemon-card__button" href="#">Release</a>
        `;

        const titleLink = article.querySelector('.pokemon-card__title');
        const figureLink = article.querySelector('.pokemon-card__figure');
        const releaseButton = article.querySelector('.pokemon-card__button');

        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          App._instance.showPokemon(pokemon);
        });

        figureLink.addEventListener('click', (e) => {
          e.preventDefault();
          App._instance.showPokemon(pokemon);
        });

        releaseButton.addEventListener('click', (e) => {
          e.preventDefault();
          const catchedPokemon = App._instance.pokemons.find((poke) => poke.id === pokemon.id);
          catchedPokemon.catched = false;
          App._instance.savePokemons();
          App._instance.showCatched();
        });
      });

    return article;
  }

  createFullCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card', 'pokemon-card--full');

    fetch(this.url)
      .then((res) => res.json())
      .then((pokemon) => {
        article.innerHTML = `
          <h1 class="pokemon-card__title" href="#">
            #${pokemon.id} ${pokemon.name}
          </h1>

          <div class="pokemon-card__left-section">
            <figure class="pokemon-card__figure">
              <img class="pokemon-card__image" src="${pokemon.sprites.front_default}">
            </figure>
            <ul class="pokemon-card__metadata">
              <li>Types: <strong>${getTypesString(pokemon.types)}</strong></li>
              <li>Weight: <strong>${pokemon.weight / 10}kg</strong></li>
              <li>Height: <strong>${pokemon.height / 10}m</strong></li>
            </ul>
          </div>

          <div class="pokemon-card__right-section">
            <table class="pokemon-card__stats-table">
              ${pokemon.stats.map((stat) => `
                <tr>
                  <td class="pokemon-card__stats-name">${stat.stat.name.toUpperCase()}</td>
                  <td class="pokemon-card__stats-value">
                    <div
                      class="pokemon-card__stats-bar"
                      style="width: ${stat.base_stat}px">
                      ${stat.base_stat}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          ${(!this.catched) ? `<a class="pokemon-card__button" href="#">Catch!</a>` : ''}
        `;

        const catchButton = article.querySelector('.pokemon-card__button');
        if (catchButton) {
          catchButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.catched = true;
            App._instance.savePokemons();
            article.removeChild(catchButton);
          });
        }
      });

    return article;
  }
}
