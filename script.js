const moviesList = document.querySelector('.movies__list');
const input = document.querySelector('input');
const btn = document.querySelector('.btn');
const container = document.querySelector('.main-content');
let totalPages = 0;
let curQuery=''
let currentPage = 1;
class API {

  fetchMovies(query='',page = 1){
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2QwN2QyOTk2MTJiYjNkYTQ3NTQwNWQ5MWFmMTI2ZSIsIm5iZiI6MTc2NTA0NzY1MC4xOTM5OTk4LCJzdWIiOiI2OTM0N2Q2MjU4OWMzM2JlMGE3MGE5ZmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.eECuWVgdTK8qFK3-k0LiIhOgaGoe75fi8ZzLGsV-tO8'
      }
    };
    const encodedQuery = encodeURIComponent(query);
    return fetch(`https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&include_adult=false&language=en-US&page=${page}`, options)
      .then(res => res.json());
  }

}
function renderMovies(movies){
  movies.forEach(movie => {

    const li= document.createElement('li');
    li.classList.add('movie-item');
    li.innerHTML=`
 <a class="card__link" href="#">
    <h1>${movie.title}</h1>
    <p>${movie.vote_average}</p>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
    <p>Дорослий: ${movie.adult == true ? 'Так': 'Ні'}</p>
    <p>Дата релізу ${movie.release_date}</p>
</a>
    `;
    const information = li.querySelector('.card__link');
    information.addEventListener('click', (e) =>{
      e.preventDefault();


      moviesList.classList.add('disactive');
      document.querySelector('.trailer').classList.add('disactive');
      document.querySelector('.load-btn').style.cssText='display: none';
      const info = document.createElement('div');
      info.classList.add('movie-info');
      info.innerHTML=`
 <h1 class="movie__title">${movie.title}</h1>
        <div class="movie__description">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
          <p class="movie__overview">${movie.overview}</p>
        </div>
        <button class="movie__btn">Back</button>
      `;
      container.prepend(info);
      const btn3 = info.querySelector('.movie__btn');
      btn3.addEventListener('click', (e) =>{
        e.preventDefault();

        info.remove();
        moviesList.classList.remove('disactive');
        document.querySelector('.trailer').classList.remove('disactive');
        document.querySelector('.load-btn').style.cssText='display: block';
      })
    })
    moviesList.appendChild(li);
  });

}
const a = new API();
btn.addEventListener('click', async (e) => {
  e.preventDefault();
  moviesList.innerHTML = '';
  curQuery = input.value
  const result = await  a.fetchMovies(`${curQuery}`,currentPage)
  renderMovies(result.results)
  input.value = '';
  totalPages = result.total_pages;
  if(currentPage<totalPages){
    loadMore();
  }

});
document.addEventListener('keydown', async (e) => {
  if(e.key === 'Enter'){
    moviesList.innerHTML = '';
    curQuery = input.value
    const result = await  a.fetchMovies(`${curQuery}`,currentPage)
    renderMovies(result.results)
    input.value = '';
    totalPages = result.total_pages;
    if(currentPage<totalPages){
      loadMore();
    }
  }
})

function loadMore (){

    const butt = document.createElement('button');
    butt.textContent='Click';
    butt.classList.add('load-btn');
    container.appendChild(butt);
    butt.addEventListener('click', async(e)=>{
      e.preventDefault();
      currentPage++;
      const data= await a.fetchMovies(curQuery,currentPage);
      renderMovies(data.results);

      totalPages=data.total_pages;

      if (currentPage >= data.total_pages) {
        butt.remove();
      }

    });

}