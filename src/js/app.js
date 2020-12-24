import Pokemon from './pokemon.js';

export default class App {
  constructor({ searchbar, navigation, pagination, wrapper }) {
    if (App._instance) return App._instance;
    else App._instance = this;
    this.searchbar = searchbar;
    this.navigation = navigation;
    this.pagination = pagination;
    this.wrapper = wrapper;
    this.pokemons = [];
    this.page = 1;
  }

  savePokemons() {
    localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
  }

  loadPokemons() {
    const storage = localStorage.getItem('pokemons');
    if (storage) {
      const pokemons = JSON.parse(storage);
      pokemons.forEach((json) => {
        this.pokemons.push(new Pokemon(json));
      });
      return true;
    } else {
      return false;
    }
  }

  fetchPokemons() {
    return fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000')
      .then((res) => res.json())
      .then((json) => json.results)
      .then((results) => {
        results.forEach((result, index) => {
          const match = result.url.match(/\https:\/\/pokeapi.co\/api\/v2\/pokemon\/(?<id>\d+)/);
          const pokemon = new Pokemon({
            id: Number(match.groups.id),
            name: result.name,
            url: result.url,
          });
          this.pokemons.push(pokemon);
        });
        this.savePokemons();
        return this.pokemons;
      });
  }

  run() {
    this.navigation.addEventListener('submit',e => e.preventDefault());

    if (this.loadPokemons()) {
      return new Promise((resolve) => resolve(this.pokemons));
    }
    return this.fetchPokemons();
  }

  updatePagination() {
    const pagesCount = Math.ceil(this.pokemons.length / 10);
    this.pagination.textContent = `${this.page} / ${pagesCount}`;
  }

  clean() {
    this.wrapper.innerHTML = '';
    this.wrapper.classList.remove('wrapper--grid');
  }

  showPokemon({ id }) {
    const pokemon = this.pokemons.find((pokemon) => pokemon.id === id);
    this.clean();
    this.wrapper.append(pokemon.createFullCard());
  }

  showHome() {
    this.clean();
    this.searchbar.input.value = '';
    const pokemons = this.pokemons.slice((this.page - 1) * 10, this.page * 10);
    pokemons.forEach((pokemon) => {
      this.wrapper.append(pokemon.createMiniCard());
    });
  }

  showCatched() {
    this.clean();
    this.searchbar.input.value = '';
    this.wrapper.classList.add('wrapper--grid');
    const catchedPokemons = this.pokemons.filter((pokemon) => pokemon.catched);
    catchedPokemons.forEach((pokemon) => {
      this.wrapper.append(pokemon.createRegularCard());
    });
  }

  showSearched(pokemons) {
    this.clean();
    pokemons.forEach((pokemon) => {
      this.wrapper.append(pokemon.createMiniCard());
    });
  }
}
