// DOM 요소 가져오기
const main = document.getElementById('main');

// 영화 상세 정보 가져오기
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

// 영화 상세 정보 렌더링
const detail = (data) => {
  const { id, title, poster_path, vote_average, overview, release_date, runtime } = data;
  const genre1 = data.genres[0].name;
  document.title = `${title}`;

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
            <label>Release Date</label>
            <span>${release_date}</span>
          </div>
          <div class="set">
            <label>Running Time</label>
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

// 대댓글 삭제
const deleteReply = (event) => {
  const commentIndex = event.target.dataset.commentIndex;
  const replyIndex = event.target.dataset.replyIndex;

  if (commentIndex !== undefined && replyIndex !== undefined) {
    const comment = comments[commentIndex];
    const reply = comment.replies[replyIndex];

    const passwordInput = event.target.parentNode.querySelector('.reply-password-input');
    const password = passwordInput.value;

    if (password !== reply.password) {
      alert('비밀번호가 맞지 않습니다.');
      return;
    }

    comment.replies.splice(replyIndex, 1);
    saveComments();
    renderComments();
  }
};

// 대댓글 제출
const submitReply = (event) => {
  console.log(event);

  event.preventDefault();

  const replyForm = event.target; // 여기서 target은 reply-form
  const commentIndex = replyForm.dataset.commentIndex; // dataset.commentIndex를 쓰는 이유, 각 코멘트의 인덱스를 저장해서 찾기 쉽게.
  const nameInput = replyForm.querySelector('.reply-name-input');
  const passwordInput = replyForm.querySelector('.reply-password-input');
  const replyInput = replyForm.querySelector('.reply-input');

  const name = nameInput.value;
  const password = passwordInput.value;
  const replyText = replyInput.value;

  if (name.trim() === '' || password.trim() === '' || replyText.trim() === '') {
    alert('Please fill in all fields.');
    return;
  } // 스페이스 쓸 경우 알림.

  const newReply = {
    name,
    password,
    comment: replyText,
  };

  comments[commentIndex].replies.push(newReply);
  saveComments();

  nameInput.value = '';
  passwordInput.value = '';
  replyInput.value = '';

  renderComments();
};

// 댓글 삭제
const deleteComment = (event) => {
  console.log(event);
  const commentIndex = event.target.dataset.commentIndex; // target은 button.delete-comment, 이 곳에 commentIndex가 dataset에 저장되어 있음. 첫번째 코멘트라면 0

  if (commentIndex !== undefined) {
    const comment = comments[commentIndex]; // comments에는 로컬 스토리지에 저장되어 있는 객체 배열 을 저장되어 있음

    const passwordInput = event.target.parentNode.querySelector('.comment-password-input'); //parrentnode는 코멘트 전체를(대댓글을 뺀) 감싸고 있는 div
    const password = passwordInput.value; // target의 부모 노드에서 다시 comment-password-input을 선택한 뒤 값을 저장.

    if (password !== comment.password) {
      alert('비밀번호가 맞지 않습니다.');
      return;
    }
    console.log(comments);
    comments.splice(commentIndex, 1); // splice는 원본 배열을 수정 제거한 요소를 반환, 여기서는 comments배열의 commentIndex 위치에 있는 요소 1개를 제거.
    saveComments();
    renderComments();
  }
};

// 댓글 제출
const submitComment = (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('name-input');
  const passwordInput = document.getElementById('password-input');
  const commentInput = document.getElementById('comment-input');

  const name = nameInput.value;
  const password = passwordInput.value;
  const commentText = commentInput.value;

  if (name.trim() === '' || password.trim() === '' || commentText.trim() === '') {
    alert('Please fill in all fields.');
    return;
  } // 입력칸에 그냥 스페이스로 썼을 때 알림.

  const newComment = {
    name,
    password,
    comment: commentText,
    replies: [],
  };
  comments.push(newComment);
  saveComments();

  nameInput.value = '';
  passwordInput.value = '';
  commentInput.value = '';

  renderComments();
};

// 댓글과 대댓글을 localStorage에 저장
const saveComments = () => {
  localStorage.setItem(movieId, JSON.stringify(comments));
};

// 대댓글 목록 렌더링
const renderReplies = (replies, commentIndex) => {
  // console.log(replies); // 리플라이 정보가 들어있는 객체 배열.
  let repliesHTML = '';

  replies.forEach((reply, replyIndex) => {
    const { name, comment: text } = reply;
    // console.log(reply);
    repliesHTML += `
      <div class="reply-item">
        <strong>${name}</strong>
        <p>${text}</p>
        <input type="password" class="reply-password-input" placeholder="Password" required />
        <i class="fas fa-trash delete-reply" data-comment-index="${commentIndex}" data-reply-index="${replyIndex}" style="cursor: pointer"></i>
      </div>
    `;
  });

  return repliesHTML;
};

// 댓글과 대댓글 목록 렌더링
const renderComments = () => {
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = '';

  comments.forEach((comment, commentIndex) => {
    const { name, comment: text, replies } = comment; // 가독성 때문에 comment:text로 text에 저장.
    // console.log(commentIndex);

    const commentItem = document.createElement('div'); // DOM에 새로운 <div> 요소 추가, 아직 HTML 문서에 추가 되지 않음.
    commentItem.classList.add('comment-item'); // commentItem에 comment-item 클래스 추가
    commentItem.innerHTML = `
      <div>
        <strong>${name}</strong>
        <p>${text}</p>
        <input type="password" class="comment-password-input" placeholder="Password" required />
        <span class="fa fa-trash delete-comment" data-comment-index="${commentIndex}" style="cursor: pointer"></span>
      </div>
      <div class="replies">
        ${renderReplies(replies, commentIndex)}
      </div>
      <form class="reply-form">
        <input type="text" class="reply-name-input" placeholder="Name" required />
        <input type="password" class="reply-password-input" placeholder="Password" required />
        <textarea class="reply-input" placeholder="Reply" required></textarea>
        <button type="submit">Reply</button>
      </form>
    `;

    // commentItem 의 하위 요소들을 선택해서 이벤트를 추가
    const replyForm = commentItem.querySelector('.reply-form');
    // console.log(replyForm); // replyForm는 htmlformelement의 인스턴스. 폼 요소에 대한 속성과 메소드가 들어있음.
    replyForm.dataset.commentIndex = commentIndex; // 데이터 검색을 쉽게 하기 위해서 dataset 속성에 인덱스 값을 저장. dataset은
    replyForm.addEventListener('submit', submitReply);

    const deleteCommentButton = commentItem.querySelector('.delete-comment');
    // console.log(deleteCommentButton);
    deleteCommentButton.addEventListener('click', deleteComment);

    const deleteReplyButtons = commentItem.querySelectorAll('.delete-reply');
    // const test = commentItem.querySelector('.delete-reply');
    // console.log(deleteReplyButtons); // commentItem 안에 들어있는 모든 delete-reply요소를 Nodelist로 반환 , 코멘트 안에 리플라이의 딜리트 버튼 하나하나에 삭제 이벤트를 주기 위해서 ALL 선택.
    // console.log(test);
    deleteReplyButtons.forEach((button) => {
      // console.log(button);
      button.addEventListener('click', deleteReply);
    });

    commentList.appendChild(commentItem);
  });
};

// 댓글 폼 제출 이벤트 처리
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', submitComment);

// URL에서 영화 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// localStorage에서 댓글 가져오기, 없으면 빈 배열로 초기화
let comments = JSON.parse(localStorage.getItem(movieId)) || [];
//movieId를 키로 하는 로컬 스토리지의 값을 가져옴, 값이 없으면 null 반환
//JSON.parse 는 Json 문자열을 객체로 변환
//console.log(comments); //객체로 된 배열

// 영화 상세 정보 및 댓글 렌더링
getMovieDetails();
renderComments();
