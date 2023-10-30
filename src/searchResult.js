import { getMovieFromKofic, getMovieFromTmdb } from "./api.js";

let currentPage = 1;
let totalMovieCount = null;
let fetchCheck = true;
const movieCardData = new Map(); // TMDB에서 가져온 영화 정보들 (제목에 검색어가 포함되어있는지 확인 후 set)
const queryString = new URLSearchParams(window.location.search).get("search");
const $cardArea = document.querySelector("#movieList-search");
const $searchInput = document.querySelector("#search__input");

$searchInput.value = queryString;

class MovieCard {
  constructor(data) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
    this.el = null;
  }

  createCardLayout() {
    const imgUrl = Boolean(this.poster_path)
      ? `https://image.tmdb.org/t/p/w500${this.poster_path}`
      : "./assets/img/noImg.jpg";
    const layout = `
                    <div class="card card-active" data-id="${this.id}">
                            <div class="card__face card__face-front">
                                <img src="${imgUrl}" alt="${this.title} 포스터" class="card__img" 
                                onerror="this.onerror=null; this.src='./assets/img/noImg.jpg'"/>
                              <div class="card__info">
                              <h3 class="card__title">${this.title}</h3>
                              <div class="stars-outer">
                              <div class="stars-inner"></div>
                            </div> (${this.vote_average.toFixed(1)})
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
    this.renderStar();
  }

  addEvent() {
    this.el.addEventListener("click", () => {
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

// 받은 array에서 카드 만드는 함수
function createCards(arr) {
  arr.forEach((n) => {
    if (!movieCardData.has(n.id)) {
      movieCardData.set(n.id);
      const card = new MovieCard(n);
      card.createCard($cardArea);
      card.addEvent();
    }
  });
}

// 영화 필터링
function filterMovies(obj, str) {
  const titleKo = obj?.movieNm || obj?.title;
  const titleOrigin = obj?.movieNmEn || obj?.original_title;
  const eroticGenre = obj?.repGenreNm === "성인물(에로)";
  const titleCheckKo = titleKo.replaceAll(" ", "").includes(str.replaceAll(" ", ""));
  const titleCheckOrigin = titleOrigin
    .toLowerCase()
    .replaceAll(" ", "")
    .includes(str.toLowerCase().replaceAll(" ", ""));
  return !eroticGenre && (titleCheckKo || titleCheckOrigin);
}

function checkMoreFetch() {
  if (totalMovieCount === null) {
    return (fetchCheck = true);
  }
  if (totalMovieCount > currentPage * 12) {
    return (fetchCheck = true);
  } else {
    return (fetchCheck = false);
  }
}

// 영화진흥위 데이터 가져오는 함수
async function koficSearch() {
  const data = await getMovieFromKofic(queryString, currentPage);
  const result = data.movieList.filter((n) => {
    return filterMovies(n, queryString);
  });

  totalMovieCount = data.totalMovieCount;
  currentPage++;

  return result;
}

// TMDB 데이터 가져오는 함수
async function tmdbSearch(str = queryString, year = null) {
  const queryTmdb = { type: "search", title: str, year: year };
  const result = await getMovieFromTmdb(queryTmdb);
  const filteredData = result.filter((n) => {
    return filterMovies(n, queryString);
  });

  return filteredData;
}

// 검색창에 입력된 언어가 한글이면 TMDB에 요청
// 검색창에 입력된 언어가 영어면 영화진흥위원회 데이터를 받은 후 해당 데이터의 한글 제목으로 TMDB에 요청
async function movieSearch() {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const hasKorean = koreanRegex.test(queryString);

  if (hasKorean) {
    //검색어가 한글일때 TMDB 요청
    let movieData = await tmdbSearch();
    createCards(movieData);
  } else {
    //검색어가 영어일 때 영화진흥위원회 요청
    const koficMovie = await koficSearch();
    const movieTitleMap = new Map();
    koficMovie.forEach((n) => {
      if (n.movieNm.includes(":")) {
        movieTitleMap.set(n.movieNm.slice(0, n.movieNm.indexOf(":")).trim()); //시리즈의 경우 시리즈명으로만 검색하게 함
      } else {
        movieTitleMap.set(n.movieNm);
      }
    });

    for (const n of movieTitleMap) {
      let movieData = await tmdbSearch(n);
      createCards(movieData);
    }
  }

  return checkMoreFetch();
}

movieSearch();

// 무한 스크롤 이벤트
let timer;

window.addEventListener("scroll", () => {
  if (fetchCheck && window.innerHeight + window.scrollY >= document.body.scrollHeight - 400) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        movieSearch();
      }, 1000);
    }
  }
});
