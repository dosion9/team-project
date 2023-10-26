const $commentForm = document.querySelector(".comment-form");
const $commentInput = document.querySelector("#comment");
const $submitBtn = document.querySelector("#submit-btn");
const $printComment = document.querySelector(".comment-list");
const $commentNum = document.querySelector(".comment-number");

let savedComment = ""; // 저장된 댓글 내용

// 로컬 스토리지에서 해당 영화의 댓글을 가져와 화면에 출력하는 함수
function displayComments(movieId) {
  const comments = JSON.parse(localStorage.getItem(movieId));

  if (comments && comments.length > 0) {
    $printComment.innerHTML = ""; //댓글 목록 초기화
    comments.sort((a, b) => new Date(b.time) - new Date(a.time)); // 최신 순으로 정렬

    comments.forEach((commentObj) => {
      $commentNum.textContent = `(${comments.length})`; //현재 코멘트 갯수

      const opinion = document.createElement("li");
      opinion.classList.add("opinion");

      const commentTime = new Date(commentObj.time);
      const hours = commentTime.getHours();
      const minutes = String(commentTime.getMinutes()).padStart(2, "0");
      const seconds = String(commentTime.getSeconds()).padStart(2, "0");
    

      // 각 댓글과 시간을 <p> 태그로 감싸서 추가
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-list');
      opinion.appendChild(leftDiv);

      const commentDiv = document.createElement("p");
      commentDiv.classList.add('comment-line');
      commentDiv.textContent = commentObj.comment;

      const timeDiv = document.createElement("p");
      timeDiv.classList.add('time');
      timeDiv.textContent = `${hours}:${minutes}:${seconds}`;

      leftDiv.appendChild(commentDiv);
      leftDiv.appendChild(timeDiv);

      const rightDiv = document.createElement('div');
      rightDiv.classList.add('right-list');
      opinion.appendChild(rightDiv);

      const goodBtn = document.createElement('button');


      $printComment.appendChild(opinion);
    });
  } else {
    $printComment.innerHTML = `댓글이 없습니다. 감상평을 등록해주세요!`;
  }
}

function setInputValue(event) {
  event.preventDefault();

  const comment = $commentInput.value;

    // input 유효성 검사
  if (comment === "") {
    alert("한줄평을 입력해주세요.");
    return;
  } else if (comment.includes('')){

  }

  const movieId = searchUrlParam("id");

  let comments = JSON.parse(localStorage.getItem(movieId)) || [];

  comments.push({ comment, time: new Date() });
  localStorage.setItem(movieId, JSON.stringify(comments));

  //댓글 입력 후 화면에 댓글 목록 업데이트
  displayComments(movieId);

  //입력 필드 초기화
  $commentInput.value = "";

  // 입력한 댓글 내용 저장
  savedComment = comment;
}

// url 파라미터에 있는 movieId에 맞는 코멘트 가져오기
function searchUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// 페이지 로드시 해당 영화의 댓글을 가져와 화면에 출력해주기
document.addEventListener("DOMContentLoaded", function () {
  const movieId = searchUrlParam("movieId");
  if (movieId) {
    displayComments(movieId);
  }

  $commentInput.value = savedComment;
});

$commentForm.addEventListener("submit", setInputValue);
