document.addEventListener('DOMContentLoaded', function () {
  const main = document.getElementById('main');

  const getMovieDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTM4NjU1N2ZkM2UyZDM3Y2EzZTZmZmVkNDBmNGYwNiIsInN1YiI6IjY0NzBiYTgzYzVhZGE1MDBjMWEzNjk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdDRFvv0qvVj6vK9qJ7qA5P5fYyYBQeOdh1G5-IB5uA',
      },
    });

    const movieDetails = await response.json();
    detail(movieDetails);
  };

  const detail = (data) => {
    console.log(data);
    const { id, title, poster_path, vote_average, overview, release_date, runtime } = data;
    const genre1 = data.genres[0].name;
    document.title = `${title}`;
    // main.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${poster_path}')`;

    main.innerHTML = `
            <div class="detail_container">
                <div class="poster">
                    <img src="https://image.tmdb.org/t/p/w500/${poster_path}" />
                </div>
                <div class="info">
                    <div class="movie-title">${title}</div>
                    <div class="movie-detail">
                        <div class="set">
                            <label>Rating</label>
                            <span>${vote_average.toFixed(1)}</span>
                        </div>
                        <div class="set">
                            <label>Realease Date</label>
                            <span>${release_date}</span>
                        </div>
                        <div class="set">
                            <label>Runnig time</label>
                            <span>${runtime} min</span>
                        </div>
                        <div class="set">
                            <label>Genre</label>
                            <span>${genre1}</span>
                        </div>
                    </div>
                    <div class="movie-description">${overview}</div>
                </div>
            </div>
        `;
  };

  getMovieDetails();
});
