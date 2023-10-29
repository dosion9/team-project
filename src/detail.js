// 영화의 상세정보를 가지고 여러가지 하는 파일

import { getMovieFromTmdb } from "./api.js";

const $dataContainer = document.querySelector(".container__detail");
const $castContainer = document.querySelector(".container__cast");

function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}
const receivedMovieId = searchParam("id");

async function initialize() {
  try {
    let obj = { type: "details", movieId: receivedMovieId };
    let movieData = await getMovieFromTmdb(obj);
    console.log(movieData);
    renderCard(movieData);
  } catch (error) {
    console.log("뭔가 망했어요! 당신을 홈으로 강제송환 합니다");
    window.location.href = "./";
  }
}
initialize();

//movie detail을 생성하는 함수
function createMovieDetail(movieData) {
  const detailCard = document.createElement("div");
  detailCard.classList.add("movie_detail__detail");
  const movieGenre = movieData.genres
    .map(function (el) {
      return el.name;
    })
    .join(", ");

  const synopDiv = document.createElement("div");
  synopDiv.classList.add("movie_detail__synopsis");

  //카드에 들어갈 요소들 정의
  const poster = createAndAppend(
    "img",
    "detail__poster",
    "src",
    `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
  );
  poster.setAttribute("onerror", "this.onerror=null; this.src='../assets/img/noImg.jpg'");
  const title = createAndAppend("h3", "detail__title", "textContent", movieData.title);
  const overview = createAndAppend("p", "detail__overview", "textContent", movieData.overview);
  const genres = createAndAppend("p", "detail__genres", "textContent", `장르 : ${movieGenre}`);
  const runtime = createAndAppend("p", "detail__runtime", "textContent", `런타임 : ${movieData.runtime} 분`);
  const vote = createAndAppend("p", "detail__vote", "textContent", `TMDB 평점 : ${movieData.vote_average}`);
  const releaseDate = createAndAppend(
    "p",
    "detail__release-date",
    "textContent",
    `개봉일자 : ${movieData.release_date}`
  );

  //위에서 정의한 요소들 DOM에 추가
  $dataContainer.appendChild(poster);
  detailCard.appendChild(title);
  detailCard.appendChild(genres);
  detailCard.appendChild(runtime);
  detailCard.appendChild(vote);
  detailCard.appendChild(releaseDate);
  $dataContainer.appendChild(detailCard);
  synopDiv.appendChild(overview);
  $dataContainer.after(synopDiv);

  //외국 영화의 경우 원어 제목을 표시해 주는 기능
  if (movieData.original_language !== "ko") {
    const oriTitle = createAndAppend("p", "detail__original-title", "textContent", `(${movieData.original_title})`);
    title.after(oriTitle);
  } else {
    const oriTitle = createAndAppend("p", "detail__original-title", "textContent", ` `);
    title.after(oriTitle);
  }
}

//생성한 디테일을 화면에 뿌리는 함수
function renderCard(movieData) {
  const cast = movieData.credits.cast;
  createMovieDetail(movieData);
  changeTitle(movieData);

  //주연급 배우만 5명(변경가능) 뽑습니다. 중요도순으로 정렬되어있습니다.
  const num = cast.length > 5 ? 5 : cast.length;
  for (let i = 0; i < num; i++) {
    const castCard = createCastCard(cast[i]);
    $castContainer.appendChild(castCard);
  }
}

//createMovieDetail와 createCastCard 내부에서 사용할 로직
function createAndAppend(tagName, className, attribute, value) {
  const element = document.createElement(tagName);
  if (className !== null) {
    element.classList.add(className);
  }
  if (attribute && value) {
    element[attribute] = value;
  }
  return element;
}

//cast 카드를 생성하는 함수
function createCastCard(castData) {
  const castCard = document.createElement("div");
  castCard.classList.add("movie_detail__cast");

  //카드에 들어갈 요소들 정의
  const profile = createAndAppend("img", null, "src", `https://image.tmdb.org/t/p/original${castData.profile_path}`);
  profile.setAttribute("onerror", "this.onerror=null; this.src='../assets/img/noImg.jpg'");
  const name = createAndAppend("p", "cast_name", "textContent", castData.original_name);

  //위에서 정의한 요소들 카드에 추가
  castCard.appendChild(profile);
  castCard.appendChild(name);

  return castCard;
}
//현재 상세페이지의 영화 제목을 tab title에도 띄워주는 함수
function changeTitle(data) {
  const pageTitle = document.querySelector("title");
  pageTitle.innerText = `5Flix - ${data.title}`;
}
