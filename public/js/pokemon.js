class Pokemon {
  constructor({ id, name, url }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.catched = false;
  }

  createMiniCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card');
    article.classList.add('pokemon-card--mini');
    article.innerHTML = `
      <a class="pokemon-card__link" href="#">
        #${this.id} ${this.name}
      </a>
      ${(!this.catched) ? '<a class="pokemon-card__button" href="#">Catch!</a>' : '' }
    `;

    const link = article.querySelector('.pokemon-card__link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      app.clean();
      app.wrapper.append(this.createFullCard());
    });

    const button = article.querySelector('.pokemon-card__button');
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.catched = true;
        article.removeChild(button);
      });
    }

    return article;
  }

  createRegularCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card');
    article.classList.add('pokemon-card--regular');

    fetch(this.url)
      .then((res) => res.json())
      .then((pokemon) => {
        let types = pokemon.types;
        types = (types.length === 1) ? `${types[0].type.name.toUpperCase()}` :
          `${types[0].type.name.toUpperCase()} / ${types[1].type.name.toUpperCase()}`;

        article.innerHTML = `
          <a class="pokemon-card__title" href="#">
            #${pokemon.order}
            ${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}
          </a>

          <figure class="pokemon-card__figure">
            <img class="pokemon-card__image" src="${pokemon.sprites.front_default}">
          </figure>
          <ul class="pokemon-card__metadata">
            <li>Types: <strong>${types}</strong></li>
          </ul>

          <a class="pokemon-card__button" href="#">Release</a>
        `;

        const link = article.querySelector('.pokemon-card__title');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          app.showPokemon(pokemon);
        });

        const button = article.querySelector('.pokemon-card__button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const catchedPokemon = app.pokemons.find((poke) => poke.id === pokemon.id);
          catchedPokemon.catched = false;
          app.showCatched();
        });
      });

    return article;
  }

  createFullCard() {
    const article = document.createElement('article');
    article.classList.add('pokemon-card');
    article.classList.add('pokemon-card--full');

    fetch(this.url)
      .then((res) => res.json())
      .then((pokemon) => {
        let types = pokemon.types;
        types = (types.length === 1) ? `${types[0].type.name.toUpperCase()}` :
          `${types[0].type.name.toUpperCase()} / ${types[1].type.name.toUpperCase()}`;

        article.innerHTML = `
          <h1 class="pokemon-card__title" href="#">
            #${pokemon.order}
            ${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}
          </h1>

          <div class="pokemon-card__left-section">
            <figure class="pokemon-card__figure">
              <img class="pokemon-card__image" src="${pokemon.sprites.front_default}">
            </figure>
            <ul class="pokemon-card__metadata">
              <li>Types: <strong>${types}</strong></li>
              <li>Weight: <strong>${pokemon.weight / 10}kg</strong></li>
              <li>Height: <strong>${pokemon.height / 10}m</strong></li>
            </ul>
          </div>

          <div class="pokemon-card__right-section">
            <table class="pokemon-card__stats">
              ${pokemon.stats.map((stat) => `
                <tr>
                  <td class="pokemon-card__stats-name">${stat.stat.name.toUpperCase()}</td>
                  <td class="pokemon-card__stats-value">
                    <div
                      class="pokemon-card__stats-bar"
                      style="width: ${stat.base_stat}px">
                    </div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
      });

    return article;
  }
}
