import { getMovieFromKofic, getMovieFromTmdb } from "./api.js";

let currentPage = 1;

// 임시 쿼리스트링
// const temporarySearch = ["search", "나쁜"];
// window.onload = function () {
//   if (searchUrlParam("search") === null) {
//     return (location.href = window.location.href + `?${temporarySearch[0]}=${temporarySearch[1]}`);
//   }
// };
// ================================================================
// 본 코드
async function fetchData(search) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWJmOTI2NzhmMjRkMmFlZWZmODRjMmJmNGQzMzI1MyIsInN1YiI6IjY1MmYyNDY2YTgwMjM2MDBjMzE2MDZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v6FiZMMIYGmNHCWIP1tTb-1iIq22jWgA1RIijiBGVdw"
    }
  };

  const url = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=ko-KR&page=1&region=KR`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error(err);
  }
}

function searchUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

const queryString = searchUrlParam("search");
const searchData = await fetchData(queryString);

const $cardArea = document.querySelector("#popular-movie");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");
const $sortBtnArea = document.querySelector("#popular-sort");

const cardInstance = [];

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
                                onerror="this.onerror=null; this.src='../assets/img/noImg.jpg'"/>
                              <div class="card__info">
                              <h3 class="card__title">${this.title}</h3>
                              <p><b>평점</b> : ${this.vote_average.toFixed(1)}</p>
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
}

// API를 통해 영화 가져오는 함수
async function getData() {
  const data = await getMovieFromKofic(queryString, currentPage);
  currentPage = data.nextPage;
  data.movieList.forEach((n, i) => {
    let obj = { type: "search", title: n.movieNm, year: n.openDt.slice(0, 4) };
    getMovieFromTmdb(obj).then((res) => {
      console.log(res);
      if (res.length !== 0) {
        res.forEach((item2) => {
          const card = new MovieCard(item2);
          card.createCard($cardArea);
          card.addEvent();
        });
      }
    });
  });
}
getData();

// === TMDB로만 카드 만드는 것 ===
// searchData.forEach((n) => {
//   const card = new MovieCard(n);
//   card.createCard($cardArea);
//   card.addEvent();
//   cardInstance.push(card);
// });
// === TMDB로만 카드 만드는 것 ===

// 무한 스크롤
let timer;

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 400) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        getData();
      }, 500);
    }
  }
});
