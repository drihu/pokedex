class App {
  constructor({ searchbar, wrapper }) {
    if (App._instance) return App._instance;
    else App._instance = this;
    this.searchbar = searchbar;
    this.wrapper = wrapper;
    this.pokemons = [];
  }

  async run() {
    return fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000')
      .then((res) => res.json())
      .then((json) => json.results)
      .then((results) => {
        results.forEach((result, index) => {
          const pokemon = new Pokemon({
            id: index + 1,
            name: result.name,
            url: result.url,
          });
          this.pokemons.push(pokemon);
        });

        return this.pokemons;
      });
  }

  clean() {
    this.wrapper.innerHTML = '';
    this.searchbar[0].value = '';
  }

  showPokemon(json) {
    const pokemon = this.pokemons.find((pokemon) => pokemon.id === json.id);
    this.clean();
    this.wrapper.append(pokemon.createFullCard());
  }

  showHome() {
    this.clean();
    this.wrapper.classList.remove('wrapper--flex');
    this.pokemons.slice(0, 10).forEach((pokemon) => {
      this.wrapper.append(pokemon.createMiniCard());
    });
  }

  showCatched() {
    this.clean();
    this.wrapper.classList.add('wrapper--flex');
    this.pokemons.filter((pokemon) => pokemon.catched).forEach((pokemon) => {
      this.wrapper.append(pokemon.createRegularCard());
    });
  }

  showSearched(pokemons) {
    this.clean();
    this.wrapper.classList.remove('wrapper--flex');
    pokemons.forEach((pokemon) => {
      this.wrapper.append(pokemon.createMiniCard());
    });
  }
}
