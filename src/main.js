import apiMovieData from "./tmdb.js";

const movieData = await apiMovieData;
const popularMovieData = {
  default: movieData.popular,
  rating: [...movieData.popular].sort((a, b) => {
    return b?.vote_average - a?.vote_average;
  })
};
const popularMovieInstance = {
  default: [],
  rating: []
};

const $cardArea = document.querySelector("#popular-movie");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");
const $sortBtnArea = document.querySelector("#popular-sort");
let $sortMethod = document.querySelector(".btn-outline-active").dataset.sort;

class MovieCard {
  constructor(data) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
    this.el = null;
  }

  createCard(parentEl) {
    const layout = createCardLayout(this);
    parentEl.insertAdjacentHTML("beforeend", layout);
    this.el = parentEl.children[parentEl.children.length - 1];
  }

  addEvent() {
    this.el.addEventListener("click", () => {
      alert(`제목 : ${this.title}\n원제 : ${this.original_title}\nID코드 : ${this.id}`);
    });
  }

  checkInclude(val) {
    const ko = this.title.includes(val);
    const en = this.original_title.toLowerCase().includes(val.toLowerCase());
    return ko || en;
  }

  toggleCard(boolean) {
    const classList = this.el.classList;
    boolean ? classList.add("card-active") : classList.remove("card-active");
  }
}

// 카드 레이아웃을 생성하는 함수
function createCardLayout(obj) {
  const imgUrl = `https://image.tmdb.org/t/p/original${obj.poster_path}`;
  const layout = `
          <div class="card" data-id="${obj.id}">
                  <div class="card__face card__face-front">
                      <img src="${imgUrl}" alt="${obj.title} 포스터" class="card__img" />
                    <div class="card__info">
                    <h3 class="card__title">${obj.title}</h3>
                    <p><b>평점</b> : ${obj.vote_average}</p>
                    </div>
                  </div>
                  <div class="card__face card__face-back" >
                    <h4 class="card__title">${obj.title}</h4>
                    <p>${obj.overview}</p>
                  </div>
                </div>
          `;
  return layout;
}

// $sortMethod의 방법으로 생성된 모든 카드들에 "card-active" 를 토글하는 함수
function toggleCardAll(boolean) {
  popularMovieInstance[$sortMethod].forEach((n) => {
    n.toggleCard(boolean);
  });
}

// $sortMethod의 방법으로 생성된 모든 카드들 중 조건에 맞는 카드에
// "card-active" 를 토글하는 함수
const searchCard = function () {
  popularMovieInstance[$sortMethod].forEach((i) => {
    const check = i.checkInclude($searchInput.value);
    i.toggleCard(check);
  });
};

for (let prop in popularMovieData) {
  popularMovieData[prop].forEach((n) => {
    const card = new MovieCard(n);
    card.createCard($cardArea);
    card.addEvent();
    popularMovieInstance[prop].push(card);
  });
}

toggleCardAll(true);

//==================== EVENT ====================
// 로딩 시 검색창으로 포커스 해주는 이벤트
onload = () => {
  $searchInput.focus();
};

// 검색창에 입력 후 검색 버튼으로 찾는 이벤트
$searchBtn.addEventListener("click", () => {
  searchCard();
});

//  검색창에 입력 후 엔터키로 찾는 이벤트
window.addEventListener("keyup", (e) => {
  if ($searchInput != false && e.key === "Enter") {
    searchCard();
  }
});

// 검색창 내용을 다 삭제했을 때 모든 카드가 보이게 하는 이벤트
$searchInput.addEventListener("input", (e) => {
  if (e.target.value === "") {
    toggleCardAll(true);
  }
});

// "**순" 버튼을 눌렀을 시 그에 맞게 카드 정렬을 하는 이벤트
$sortBtnArea.addEventListener("click", function (e) {
  $searchInput.value = null;
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove("btn-outline-active");
  }
  e.target.classList.add("btn-outline-active");
  toggleCardAll(false);
  $sortMethod = document.querySelector(".btn-outline-active").dataset.sort;
  toggleCardAll(true);
});
