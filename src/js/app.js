import Pokemon from './pokemon.js';

export default class App {
  constructor({ searchbar, wrapper }) {
    if (App._instance) return App._instance;
    else App._instance = this;
    this.searchbar = searchbar;
    this.wrapper = wrapper;
    this.pokemons = [];
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

  run() {
    if (this.loadPokemons()) {
      return new Promise((resolve) => resolve(this.pokemons));
    }

    return fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000')
      .then((res) => res.json())
      .then((json) => json.results)
      .then((results) => {
        results.forEach((result, index) => {
          const match = result.url.match(/\https:\/\/pokeapi.co\/api\/v2\/pokemon\/(?<id>\d+)/)
          const pokemon = new Pokemon({
            id: Number(match.groups.id),
            name: result.name,
            url: result.url,
          });
          this.pokemons.push(pokemon);
        });

        localStorage.setItem('pokemons', JSON.stringify(this.pokemons));

        return this.pokemons;
      });
  }

  clean() {
    this.wrapper.innerHTML = '';
    this.wrapper.classList.remove('wrapper--grid');
    this.searchbar[0].value = '';
  }

  showPokemon(json) {
    const pokemon = this.pokemons.find((pokemon) => pokemon.id === json.id);
    this.clean();
    this.wrapper.append(pokemon.createFullCard());
  }

  showHome() {
    this.clean();
    this.pokemons.slice(0, 10).forEach((pokemon) => {
      this.wrapper.append(pokemon.createMiniCard());
    });
  }

  showCatched() {
    this.clean();
    this.wrapper.classList.add('wrapper--grid');
    this.pokemons.filter((pokemon) => pokemon.catched).forEach((pokemon) => {
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
