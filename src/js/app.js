import {
  fetchAllPokemons,
  createMiniCard,
  createRegularCard,
  fetchPokemon,
  createFullCard,
} from './pokemon.js';

// export default class App {
//   constructor({ searchbar, navigation, pagination, browserContent, wrapper }) {
//     if (App._instance) return App._instance;
//     else App._instance = this;
//     this.searchbar = searchbar;
//     this.navigation = navigation;
//     this.pagination = pagination;
//     this.browserContent = browserContent;
//     this.wrapper = wrapper;
//     this.pokemons = [];
//     this.page = 1;
//   }

//   savePokemons() {
//     localStorage.setItem("pokemons", JSON.stringify(this.pokemons));
//   }

//   loadPokemons() {
//     const storage = localStorage.getItem("pokemons");
//     if (storage) {
//       const pokemons = JSON.parse(storage);
//       pokemons.forEach((json) => {
//         this.pokemons.push(new Pokemon(json));
//       });
//       return true;
//     } else {
//       return false;
//     }
//   }

//   fetchPokemons() {
//     return fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000")
//       .then((res) => res.json())
//       .then((json) => json.results)
//       .then((results) => {
//         results.forEach((result, index) => {
//           const match = result.url.match(
//             /\https:\/\/pokeapi.co\/api\/v2\/pokemon\/(?<id>\d+)/
//           );
//           const pokemon = new Pokemon({
//             id: Number(match.groups.id),
//             name: result.name,
//             url: result.url,
//           });
//           this.pokemons.push(pokemon);
//         });
//         this.savePokemons();
//         return this.pokemons;
//       });
//   }

//   run() {
//     this.navigation.addEventListener("submit", (e) => e.preventDefault());

//     if (this.loadPokemons()) {
//       return new Promise((resolve) => resolve(this.pokemons));
//     }
//     return this.fetchPokemons();
//   }

//   updatePagination() {
//     const pagesCount = Math.ceil(this.pokemons.length / 10);
//     this.pagination.textContent = `${this.page} / ${pagesCount}`;
//   }

//   clean() {
//     this.wrapper.innerHTML = "";
//     this.wrapper.classList.remove("wrapper--grid");
//   }

//   showPokemon({ id }) {
//     const pokemon = this.pokemons.find((pokemon) => pokemon.id === id);
//     this.clean();
//     this.wrapper.append(pokemon.createFullCard());
//   }

//   showHome() {
//     this.clean();
//     this.searchbar.input.value = "";
//     const pokemons = this.pokemons.slice((this.page - 1) * 10, this.page * 10);
//     pokemons.forEach((pokemon) => {
//       this.browserContent.append(pokemon.createMiniCard());
//     });
//   }

//   showCatched() {
//     this.clean();
//     this.searchbar.input.value = "";
//     this.wrapper.classList.add("wrapper--grid");
//     const catchedPokemons = this.pokemons.filter((pokemon) => pokemon.catched);
//     catchedPokemons.forEach((pokemon) => {
//       this.wrapper.append(pokemon.createRegularCard());
//     });
//   }

//   showSearched(pokemons) {
//     this.clean();
//     pokemons.forEach((pokemon) => {
//       this.wrapper.append(pokemon.createMiniCard());
//     });
//   }
// }

export default class App {
  constructor({ searchbar, pagination, searchResult, wrapper }) {
    if (App._instance) return App._instance;
    else App._instance = this;

    this.searchbar = searchbar;
    this.pagination = pagination;
    this.searchResult = searchResult;
    this.wrapper = wrapper;
  }

  async loadPokemons() {
    const storedPokemons = localStorage.getItem('pokemons');

    if (storedPokemons) {
      return JSON.parse(storedPokemons);
    } else {
      const pokemons = await fetchAllPokemons();
      pokemons.forEach((pokemon) => {
        pokemon.id = Number(pokemon.url.match(/\/(?<id>\d+)\/$/).groups.id);
        pokemon.isCatched = false;
      });
      return pokemons;
    }
  }

  savePokemons() {
    localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
  }

  showPagination() {
    this.pagination.page.value = this.page;
  }

  showSearchedPokemons(pokemons) {
    this.searchResult.innerHTML = '';

    if (pokemons) {
      pokemons.forEach((pokemon) => {
        const miniCard = createMiniCard(pokemon, this);
        this.searchResult.appendChild(miniCard);
      });
    } else {
      const slicedPokemons = this.pokemons.slice(
        10 * (this.page - 1),
        10 * this.page
      );
      slicedPokemons.forEach((pokemon) => {
        const miniCard = createMiniCard(pokemon, this);
        this.searchResult.appendChild(miniCard);
      });
    }
  }

  showCatchedPokemons() {
    const catchedPokemons = this.pokemons.filter(
      (pokemon) => pokemon.isCatched
    );

    this.wrapper.innerHTML = '';

    catchedPokemons.forEach(async (pokemon) => {
      const pokemonData = await fetchPokemon(pokemon.id);
      const regularCard = createRegularCard(pokemonData, this);
      this.wrapper.appendChild(regularCard);
    });
  }

  showPokemon(pokemonData) {
    this.wrapper.classList.remove('wrapper--grid');
    this.wrapper.innerHTML = 'LOADING...';
    const fullCard = createFullCard(pokemonData, this);
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(fullCard);
  }

  async init() {
    this.pokemons = await this.loadPokemons();
    this.page = 1;
    this.wrapper.innerHTML = '';
    this.showPagination();
    this.showSearchedPokemons();
  }
}
