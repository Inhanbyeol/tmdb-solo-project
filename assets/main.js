const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movielist = document.getElementById('movielist');

window.addEventListener('load', async () => {
  const api = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTM4NjU1N2ZkM2UyZDM3Y2EzZTZmZmVkNDBmNGYwNiIsInN1YiI6IjY0NzBiYTgzYzVhZGE1MDBjMWEzNjk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdDRFvv0qvVj6vK9qJ7qA5P5fYyYBQeOdh1G5-IB5uA',
    },
  });
  const { results } = await api.json();

  console.log(results);

  results.forEach((info) => {
    movielist.innerHTML += `<div class="col-lg-3 mb-3" onclick="alert('영화 id : ${info.id}')" style="cursor:pointer;">
          <div class="card" style="width: 18rem;">
            <img src="https://image.tmdb.org/t/p/original/${info['poster_path']}" class="card-img-top" alt="..." style="height:400px;">
            <div class="card-body">
              <h4 class="card-title">${info.title}</h4>
              <div style="text-align:left; font-size:14px;">
              <p><b>평점</b> : ${info.vote_average}점</p>
              <span class="mb-3"><b>요약</b></span><br>
              </div>
              <p class="card-text" style="overflow: auto; height:100px; font-size:14px; text-align:left;">${info.overview}</p>
            </div>
          </div>
        </div>`;
  });
});

searchBtn.addEventListener('click', async () => {
  const target = searchInput.value;

  if (!target) return alert('검색 창에 내용을 입력해 주세요.');

  const api = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTM4NjU1N2ZkM2UyZDM3Y2EzZTZmZmVkNDBmNGYwNiIsInN1YiI6IjY0NzBiYTgzYzVhZGE1MDBjMWEzNjk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdDRFvv0qvVj6vK9qJ7qA5P5fYyYBQeOdh1G5-IB5uA',
    },
  });
  const { results } = await api.json();

  const findResult = results.filter((x) => x.title.toUpperCase().indexOf(target.toUpperCase()) !== -1);

  if (findResult.length == 0) return alert('검색 결과가 없습니다.');

  movielist.innerHTML = '';

  findResult.forEach((info) => {
    movielist.innerHTML += `<div class="col-lg-3 mb-3" onclick="alert('영화 id : ${info.id}')" style="cursor:pointer;">
          <div class="card" style="width: 18rem;">
            <img src="https://image.tmdb.org/t/p/original/${info['poster_path']}" class="card-img-top" alt="..." style="height:400px;">
            <div class="card-body">
              <h4 class="card-title">${info.title}</h4>
              <div style="text-align:left; font-size:14px;">
              <p><b>평점</b> : ${info.vote_average}점</p>
              <span class="mb-3"><b>요약</b></span><br>
              </div>
              <p class="card-text" style="overflow: auto; height:100px; font-size:14px; text-align:left;">${info.overview}</p>
            </div>
          </div>
        </div>`;
  });
});
