const homeLink = document.querySelector('#home-link');
const catchedLink = document.querySelector('#catched-link');
const searchbar = document.querySelector('#searchbar');
const wrapper = document.querySelector('#wrapper');
const app = new App({ searchbar, wrapper });

app.run().then((pokemons) => {
  app.showHome();

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
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

  app.searchbar.addEventListener('submit', (e) => {
    e.preventDefault();
    const string = e.target[0].value;
    if (!string) return;
    const searchedPokemons = pokemons.filter(
      (pokemon) => pokemon.name.match(string.toLowerCase()),
    );
    app.showSearched(searchedPokemons);
  });

});
