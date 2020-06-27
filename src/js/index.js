import App from './app.js';

const homeLink = document.querySelector('#home-link');
const catchedLink = document.querySelector('#catched-link');
const searchbar = document.querySelector('#searchbar');
const navigation = document.querySelector('#navigation');
const wrapper = document.querySelector('#wrapper');
const app = new App({ searchbar, navigation, wrapper });
const pagination = app.navigation.querySelector('#pagination');

app.run().then((pokemons) => {
  app.pagesCount = Math.ceil(pokemons.length / 10);
  app.showHome();

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    app.page = 1;
    pagination.textContent = `${app.page} / ${app.pagesCount}`;
    app.showHome();
    homeLink.classList.add('navbar__link--selected');
    catchedLink.classList.remove('navbar__link--selected');
  });

  catchedLink.addEventListener('click', (e) => {
    e.preventDefault();
    app.showCatched();
    homeLink.classList.remove('navbar__link--selected');
    catchedLink.classList.add('navbar__link--selected');
  });

  app.navigation.previous.addEventListener('click', (e) => {
    if (app.page === 1) return;
    app.page -= 1;
    pagination.textContent = `${app.page} / ${app.pagesCount}`;
    app.showHome();
  });

  app.navigation.next.addEventListener('click', (e) => {
    if (app.page === app.pagesCount) return;
    app.page += 1;
    pagination.textContent = `${app.page} / ${app.pagesCount}`;
    app.showHome();
  });

  app.searchbar.addEventListener('submit', (e) => {
    e.preventDefault();
    const string = e.target.input.value;
    if (!string) return;

    const searchedPokemons = pokemons.filter(
      (pokemon) => pokemon.name.match(string.toLowerCase()),
    );
    app.showSearched(searchedPokemons);
  });
});
