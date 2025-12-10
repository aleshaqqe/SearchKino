
  function fetchTrailer(movieId){
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2QwN2QyOTk2MTJiYjNkYTQ3NTQwNWQ5MWFmMTI2ZSIsIm5iZiI6MTc2NTA0NzY1MC4xOTM5OTk4LCJzdWIiOiI2OTM0N2Q2MjU4OWMzM2JlMGE3MGE5ZmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.eECuWVgdTK8qFK3-k0LiIhOgaGoe75fi8ZzLGsV-tO8'

      }
    };

    return fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, options)
      .then(res => res.json())
      .then(data => console.log(data));
  }


  fetchTrailer(550);