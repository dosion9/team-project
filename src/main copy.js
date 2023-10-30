import apiMovieData from "./tmdb.js";
import { getMovieFromTmdb } from "./api.js";

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

const $popularCardArea = document.querySelector("#movieList-popular");
const $upcomingCardArea = document.querySelector("#movieList-upcoming");
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

  createCardLayout() {
    const imgUrl = `https://image.tmdb.org/t/p/w500${this.poster_path}`;
    const layout = `
                    <div class="card card-active" data-id="${this.id}">
                            <div class="card__face card__face-front">
                                <img src="${imgUrl}" alt="${this.title} 포스터" class="card__img" 
    onerror="this.onerror=null; this.src='../assets/img/noImg.jpg'" />
                              <div class="card__info">
                              <h3 class="card__title">${this.title}</h3>
                              <p><b>평점</b> : ${this.vote_average.toFixed(1)}</p>
                              <p><b>평점</b> : <div class="stars-outer">
                              <div class="stars-inner"></div>
                            </div></p>
                              </div>
                            </div>
                            <div class="card__face card__face-back" >
                              <h4 class="card__title">${this.title}</h4>
                              <p>${this.overview}</p>
                            </div>
                          </div>
                    `;
    return layout;
  }

  createCard(parentEl) {
    parentEl.insertAdjacentHTML("beforeend", this.createCardLayout());
    this.el = parentEl.children[parentEl.children.length - 1];
    // console.log(this.el);
  }

  addEvent() {
    this.el.addEventListener("click", () => {
      // 클릭 시 페이지 이동
      const detailLink = `./detail.html?id=${this.id}`;
      return (location.href = detailLink);
    });
  }

  renderStar() {
    const ratings = this.vote_average.toFixed(1) / 2;

    // total number of stars
    const starTotal = 5;

    const starPercentage = (ratings / starTotal) * 100;
    const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
    this.el.querySelector(`.stars-inner`).style.width = starPercentageRounded;
  }
}

const snapShotPopular = await getMovieFromTmdb({ type: "popular" });
const snapShotUpcoming = await getMovieFromTmdb({ type: "upcoming" });

snapShotPopular.forEach((n) => {
  const card = new MovieCard(n);
  card.createCard($popularCardArea);
  card.addEvent();
  card.renderStar();
});

snapShotUpcoming.forEach((n) => {
  const card = new MovieCard(n);
  card.createCard($upcomingCardArea);
  card.addEvent();
  card.renderStar();
});

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
