import { getMovieFromKofic, getMovieFromTmdb } from "./api.js";

let currentPage = 1;
let totalMovieCount = null;

// TMDB에서 가져온 영화 정보들 (제목에 검색어가 포함되어있는지 확인 후 set)
const movieCardData = new Map();
let printCardCount = 0;

// ================================================================
// 본 코드

const queryString = new URLSearchParams(window.location.search).get("search");
const $cardArea = document.querySelector("#movieList-search");
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

// 영화 필터링
function filterMovies(obj, str) {
  const titleKo = obj?.movieNm || obj?.title;
  const titleOrigin = obj?.movieNmEn || obj?.original_title;
  const eroticGenre = obj?.repGenreNm === "성인물(에로)";
  const titleCheckKo = titleKo.replaceAll(" ", "").includes(str.replaceAll(" ", ""));
  const titleCheckOrigin = titleOrigin.toLowerCase().replaceAll(" ", "").includes(str.toLowerCase());
  return !eroticGenre && (titleCheckKo || titleCheckOrigin);
}

// 영화진흥위원회 API를 사용해서 데이터 가져오기
// 데이터 가져오기는 정상적으로 작동하지만 여기에서 받은 데이터를 가지고
// TMDB로 요청했을 때 발생하는 문제들을 해결하지 못해 사용 X
// async function getDataFromKofic() {
//   const data = await getMovieFromKofic(queryString, currentPage);
//   totalMovieCount === null ? (totalMovieCount = data.totalMovieCount) : (totalMovieCount -= 12);
//   currentPage++; //다음번에 가져올 페이지
//   const result = data.movieList.filter((n) => {
//     return filterMovies(n, queryString);
//   });

//   return result;
// }

// async function getData2() {
//   const data1 = await getDataFromKofic();
//   data1.forEach((n, i) => {
//     const obj = { type: "search", title: n.movieNmEn, year: n.prdtYear };
//     getMovieFromTmdb(obj).then((res) => {
//       // ========== 절대 나오면 안되는 경우 (시작) ==========
//       const warning = `검색어 : ${n.movieNm}\n${res.map((i) => {
//         return "나온거 : " + i.title + `\n`;
//       })}이거 나오면 같은 연도 같은 한글 제목의 영화가 있다는거니 큰일났다고 생각하면된다... 절대 출력되면 안된다....`;
//       if (res.length >= 2) {
//         console.error(warning);
//         alert(warning);
//       }
//       // ========== 절대 나오면 안되는 경우 (종료) ==========
//       if (res.length !== 0) {
//         snapShootTmdb.push(...res);
//       }
//       console.log(n.movieNm, res);
//       // snapShootTmdb.push();
//     });
//   });

//   fff222.forEach((n) => {
//     const obj = { type: "search", title: n.movieNm, year: n.openDt.slice(0, 4) };
//     getMovieFromTmdb(obj)
//       .then((res) => {
//         console.log(res);
//         if (res.length !== 0) {
//           const tmdbMovies = res.filter((i) => {
//             return i?.title === obj.title;
//           });
//           tmdbMovies.length >= 2 ? console.log("TMDB에서 가져온 데이터가 2개네?") : null;
//           console.log();
//           return tmdbMovies;
//         }
//       })
//       .then((res) => {
//         const card = new MovieCard(res);
//         card.createCard($cardArea);
//         card.addEvent();
//       });
//   });
// }

// ================= NEW =============================
// 검색어가 영어일 때와 한글일 때를 구분하자
// 검색어가 한글일 때 => 바로 TMDB
// 검색어가 영어일 때 => 영화진흥위 => TMDB

// 영어일떄

// 한글일떄 (완성)
function koSearch(str) {
  const queryTmdb = { type: "search", title: str, year: null };
  getMovieFromTmdb(queryTmdb).then((res) => {
    const targetMovies = res.filter((n) => {
      return filterMovies(n, queryString);
    });

    targetMovies.forEach((n) => {
      if (!movieCardData.has(n.id)) {
        movieCardData.set(n.id);
        const card = new MovieCard(n);
        card.createCard($cardArea);
        card.addEvent();
      }
    });
  });
}

koSearch(queryString);

// 무한 스크롤
let timer;

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 400) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        console.log(movieCardData);
      }, 1000);
    }
  }
});
