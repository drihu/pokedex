import 'regenerator-runtime/runtime';
import App from './app.js';

const searchbar = document.querySelector('#searchbar');
const pagination = document.querySelector('#pagination');
const searchResult = document.querySelector('#search-result');
const wrapper = document.querySelector('#wrapper');
const homeLink = document.querySelector('#home-link');
const catchedLink = document.querySelector('#catched-link');

const app = new App({ searchbar, pagination, searchResult, wrapper });

app.init();

homeLink.addEventListener('click', (event) => {
  event.preventDefault();
  app.init();
  homeLink.classList.add('navbar__link--selected');
  catchedLink.classList.remove('navbar__link--selected');
});

catchedLink.addEventListener('click', (event) => {
  event.preventDefault();
  app.showCatchedPokemons();
  homeLink.classList.remove('navbar__link--selected');
  catchedLink.classList.add('navbar__link--selected');
  app.wrapper.classList.add('wrapper--grid');
});

app.pagination.previous.addEventListener('click', (event) => {
  event.preventDefault();
  if (app.page === 1) return;

  app.page -= 1;
  app.showPagination();
  app.showSearchedPokemons();
});

app.pagination.next.addEventListener('click', (event) => {
  event.preventDefault();
  const pagesCount = Math.ceil(app.pokemons.length / 10);
  if (app.page === pagesCount) return;

  app.page += 1;
  app.showPagination();
  app.showSearchedPokemons();
});

app.searchbar.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchText = event.target.input.value;

  if (searchText) {
    const filteredPokemons = app.pokemons.filter((pokemon) =>
      pokemon.name.match(searchText.toLowerCase())
    );
    app.showSearchedPokemons(filteredPokemons);
  } else {
    app.showSearchedPokemons();
  }
});
