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

//inhanbyeol
const commentNickname = document.getElementById('commentNickname');
const commentPassword = document.getElementById('commentPassword');
const commentBtn = document.getElementById('commentBtn');
const commentBox = document.getElementById('commentBox');
const commentList = document.getElementById('commentList');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

commentBtn.addEventListener('click', () => {
  if (!commentNickname.value.trim()) return alert('닉네임을 입력해 주세요.');
  if (!commentPassword.value.trim()) return alert('패스워드를 입력해 주세요.');
  if (!commentBox.value.trim()) return alert('내용을 입력해 주세요.');

  if (!/^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/.test(commentNickname.value)) return alert('닉네임은 2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성해 주세요.');
  if (!/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/.test(commentPassword.value)) return alert('비밀번호는 최소 8~16자 영문, 숫자를 조합해 주세요.');

  localStorage.setItem(self.crypto.randomUUID(), JSON.stringify(new Createcomment()));

  alert('저장되었습니다.');
  window.location.reload();
});

Object.keys(localStorage)
  .map((x) => ({ ...JSON.parse(localStorage.getItem(x)), key: x }))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .forEach((data) => {
    if (data.movieid == movieId) {
      commentList.innerHTML += `<div class="card">

                <div class="col-md-8">
                  <div class="card-body" id="commentcard">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text" style="margin-bottom: 0px;">${data.comment}</p>
                    <p class="card-text" style="margin-bottom: 0px; margin-top: 10px;"><small class="text-muted">${new Date(data.date).toLocaleString('ko-KR')}</p>
                    <p class="card-text" style="margin-bottom: 15px; margin-top: 10px;">
                      <small class="text-danger btn-edit-confirm"
                          style="cursor: pointer;" data-id="${data.key}" onclick="test()"><u>edit</u></small>
                      <small class="text-danger"
                      style="cursor: pointer;" id="del" data-id="${data.key}" onclick="test()"><u>Delete</u></small>
                    </p>

                    <div class="edit-wrap hidden">
                      <div class="input-box">
                        <textarea class="form-control editTextarea" rows="3" placeholder="수정할 내용을 입력해주세요."></textarea>
                      </div>
                      <button type="button" class="btn btn-outline-primary btn-sm btn-edit-complete">수정 완료</button>
                    </div>

                    <div class="row" style="display:none;" id="delbox">
                      <div class="col-auto" style="display:flex">
                        <input type="password" class="form-control" placeholder="Password" id="deletePassword" style="max-width:200px; margin-right: 10px;">
                         <button class="btn btn-danger" id="deleteBtn" style=" margin-right: 5px;">delete</button>
                        <button class="btn btn-primary" id="backBtn">back</button>
                      </div>
                      </div>
                    </div>
                  </div>
               
              </div>
            </div>`;
    }
  });

// for (let i = 0; i < localStorage.length; i++) {
//   const data = JSON.parse(localStorage.getItem(localStorage.key(i)));
//   if (data.movieid == movieId) {
//     commentList.innerHTML += `<div class="card">

//               <div class="col-md-8">
//                 <div class="card-body" id="commentcard">
//                   <h5 class="card-title">${data.name}</h5>
//                   <p class="card-text" style="margin-bottom: 0px;">${data.comment}</p>
//                   <p class="card-text" style="margin-bottom: 0px; margin-top: 10px;"><small class="text-muted">${data.date}</p>
//                   <p class="card-text" style="margin-bottom: 0px; margin-top: 10px;"><small class="text-danger"
//                       style="cursor: pointer;" id="del" data-id="${localStorage.key(i)}"><u>Delete</u></small>
//                   </p>

//                   <div class="row" style="display:none;" id="delbox">
//                     <div class="col-auto" style="display:flex">
//                       <input type="password" class="form-control" placeholder="Password" id="deletePassword" style="max-width:200px; margin-right: 10px;">
//                        <button class="btn btn-danger" id="deleteBtn" style=" margin-right: 5px;">delete</button>
//                       <button class="btn btn-primary" id="backBtn">back</button>
//                     </div>
//                     </div>
//                   </div>

//                 </div>

//             </div>
//           </div>`;
//   }
// }

document.querySelectorAll('#commentcard').forEach((x) => {
  x.querySelector('#del').addEventListener('click', () => {
    x.querySelector('#delbox').style.display = 'block';
    x.querySelector('#del').style.display = 'none';
  });

  x.querySelector('#deleteBtn').addEventListener('click', () => {
    if (!x.querySelector('#deletePassword').value) return alert('패스워드를 입력해 주세요.');
    if (JSON.parse(localStorage.getItem(x.querySelector('#del').dataset.id)).password !== x.querySelector('#deletePassword').value) return alert('암호가 일치하지 않습니다.');

    localStorage.removeItem(x.querySelector('#del').dataset.id);
    alert('삭제가 완료되었습니다.');
    window.location.reload();
  });

  x.querySelector('#backBtn').addEventListener('click', () => {
    x.querySelector('#delbox').style.display = 'none';
    x.querySelector('#del').style.display = 'block';
  });
});

class Createcomment {
  constructor() {
    this.name = commentNickname.value;
    this.password = commentPassword.value;
    this.comment = commentBox.value;
    this.date = new Date();
    this.movieid = movieId;
  }
}


// 리뷰 수정하기
const editConfirmButtons = document.querySelectorAll('.btn-edit-confirm');

editConfirmButtons.forEach(button => {
  button.addEventListener('click', () => {
    const reviewItem = button.closest('#commentcard')
    console.log(reviewItem)
    const itemId = button.dataset.id;
    const thisLocalStorage = JSON.parse(localStorage.getItem(itemId));
    console.log(itemId)

    const promptValue = prompt('댓글을 작성했을 때 입력한 비밀번호를 작성해주세요.');

    if (promptValue === thisLocalStorage.password) {
      reviewItem.querySelector('.edit-wrap').classList.remove('hidden');

      const editTextarea = reviewItem.querySelector('.editTextarea');
      const editCompelteButton = reviewItem.querySelector('.btn-edit-complete');

      let isContentChanged = false;

      let editContent; // 수정한값
      const handleInputChange = () => {
        // console.log(editContent);
        editContent = editTextarea.value;
        thisLocalStorage.comment = editContent;
        // console.log(thisLocalStorage.text);
        // console.log(editContent);
        isContentChanged = true;
      };

      editTextarea.addEventListener('input', handleInputChange);

      editCompelteButton.addEventListener('click', () => {

        if (!isContentChanged || editContent === '') {
          alert('수정내용을 입력해주세요.');
          return;
        } else {
          localStorage.setItem(itemId, JSON.stringify(thisLocalStorage));
        }
        location.reload();

      });

    } else {
      alert('올바른 패스워드를 입력해주세요.');
    }
  });
});