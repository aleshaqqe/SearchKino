const moviesList = document.querySelector('.movies__list');
const input = document.querySelector('input');
const btn = document.querySelector('.btn');
const container = document.querySelector('.main-content');
let totalPages = 0;
let curQuery=''
let currentPage = 1;
let loadMoreVisible = true;

class API {

  async fetchMovies(query='',page = 1){
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
  async fetchTrailer(movieId){
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2QwN2QyOTk2MTJiYjNkYTQ3NTQwNWQ5MWFmMTI2ZSIsIm5iZiI6MTc2NTA0NzY1MC4xOTM5OTk4LCJzdWIiOiI2OTM0N2Q2MjU4OWMzM2JlMGE3MGE5ZmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.eECuWVgdTK8qFK3-k0LiIhOgaGoe75fi8ZzLGsV-tO8'

      }
    };

    return fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=uk-UA`, options)
      .then(res => res.json())
      .then(data => {
        const trailer = data.results.find(video=>video.type==='Trailer' && video.site==='YouTube');
        return trailer ? trailer.key : 'Trailer not found';
      });
  }

};
function getTrailerIframe(key) {
  if (!key) return null;

  return `
    <iframe 
      width="100%" 
      height="500" 
      src="https://www.youtube.com/embed/${key}" 
      title="Trailer"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
}


function toggleLoadMore(show){
  loadMoreVisible = show;
  const btn = document.querySelector('.more-btn');
  if(!btn) return;
  if(show){
    btn.classList.remove('disactive');

  }else{
    btn.classList.add('disactive');
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
    <svg class="favourite" style='width:50px; height:66px;'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z"/></svg>
</a>
    `;
    const information = li.querySelector('.card__link');
    information.addEventListener('click', (e) =>{
      e.preventDefault();
      toggleLoadMore(false);
      moviesList.classList.add('disactive');
      document.querySelector('.trailer').classList.add('disactive');
      const info = document.createElement('div');
      info.classList.add('movie-info');
      info.innerHTML=`
 <h1 class="movie__title">${movie.title}</h1>
        <div class="movie__description">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
          <p class="movie__overview">${movie.overview}</p>
        </div>
        <div class="trailer__container">
       
        
        
        </div>
        <button class="movie__btn">Back</button>
      `;
      container.prepend(info);

      const trailerContainer = info.querySelector('.trailer__container');
      a.fetchTrailer(movie.id).then(key=>{
        if(!key || key==="Trailer not found"){
          trailerContainer.innerHTML='Trailer not Found!'
        }else{
          trailerContainer.innerHTML=getTrailerIframe(key);
        }
      })
      const btn3 = info.querySelector('.movie__btn');
      btn3.addEventListener('click', (e) =>{
        e.preventDefault();

        info.remove();
        moviesList.classList.remove('disactive');
          document.querySelector('.trailer').classList.remove('disactive');
        toggleLoadMore(currentPage < totalPages);

      })
    })
    moviesList.appendChild(li);
  });

}
const a = new API();

async function searchMovies() {
  moviesList.innerHTML = '';
  curQuery = input.value
  const result = await  a.fetchMovies(`${curQuery}`,currentPage)
  renderMovies(result.results)
  input.value = '';
  totalPages = result.total_pages;
  const btn = document.querySelector('.more-btn');
  if(btn){
    btn.remove();
  }
  if(currentPage<totalPages){
    loadMore();

  }
}
btn.addEventListener('click',  (e) => {
  e.preventDefault();
  currentPage=1;
  searchMovies();

});
document.addEventListener('keydown', async (e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    currentPage=1;
    searchMovies();
}})

function loadMore (){
  if(document.querySelector('.more-btn')) return;

  const butt = document.createElement('button');
  butt.textContent='Load More';
  butt.classList.add('more-btn');

  // Применяем текущий статус видимости
  if(!loadMoreVisible){
    butt.classList.add('disactive');
  }

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
