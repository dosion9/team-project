// 영화의 상세정보를 가지고 여러가지 하는 파일

const $dataContainer = document.querySelector(".container__detail");
const $castContainer = document.querySelector(".container__cast");
let movieId = 238; // 이부분은 나중에 쿼리 스트링에서 따오는 값으로 동적으로 변경

function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}
const receivedMovieId = searchParam("id");

const url = `https://api.themoviedb.org/3/movie/${receivedMovieId}?append_to_response=credits&language=ko-ko`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzUxODEzMGMyNmQyNDk3MTQzMzI0ZDE2ZmQ5ZmRjMiIsInN1YiI6IjY1MmYzMGEzZWE4NGM3MDBjYTEyYWYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MDJteH71TG0WQ7joW6cLBTmEwqEvkwDjud9DOqQ3WnQ"
  }
};

async function initialize() {
  try {
    let movieData = await getData(url);
    console.log(movieData);
    renderCard(movieData);
  } catch (error) {
    console.log("뭔가 망했어요! 당신을 홈으로 강제송환 합니다");
    window.location.href = "./";
  }
}
initialize();

async function getData(url) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//movie detail 카드를 생성하는 함수
function createMovieDetail(movieData) {
  const detailCard = document.createElement("div");
  detailCard.classList.add("movie_detail__detail");
  const movieGenre = movieData.genres;
  const getGenre = movieGenre
    .map(function (el) {
      return el.name;
    })
    .toString()
    .replaceAll(",", ", ");
  const synopDiv = document.createElement("div");
  synopDiv.classList.add("movie_detail__synopsis");

  //카드에 들어갈 요소들 정의
  const poster = document.createElement("img");
  poster.setAttribute("src", `https://image.tmdb.org/t/p/w300${movieData.poster_path}`);
  poster.classList.add("detail__poster");

  const title = document.createElement("h3");
  title.textContent = movieData.title;
  title.classList.add("detail__title");

  const overview = document.createElement("p");
  overview.textContent = `${movieData.overview}`;
  overview.classList.add("detail__overview");

  const genres = document.createElement("p");
  genres.textContent = `장르 : ${getGenre}`;
  genres.classList.add("detail__genres");

  const runtime = document.createElement("p");
  runtime.textContent = `런타임 : ${movieData.runtime} 분`;
  runtime.classList.add("detail__runtime");

  const vote = document.createElement("p");
  vote.textContent = `TMDB 평점 : ${movieData.vote_average} `;
  vote.classList.add("detail__vote");

  const releaseDate = document.createElement("p");
  releaseDate.textContent = `개봉일자 : ${movieData.release_date}`;
  releaseDate.classList.add("detail__release-date");

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
    console.log(movieData.original_title);
    const oriTitle = document.createElement("p");
    oriTitle.textContent = `(${movieData.original_title})`;
    oriTitle.classList.add("detail__original-title");
    title.after(oriTitle);
  } else {
    console.log(movieData.original_title);
    const oriTitle = document.createElement("p");
    oriTitle.textContent = ``;
    oriTitle.classList.add("detail__original-title");
    title.after(oriTitle);
  }
}
//생성한 디테일을 화면에 뿌리는 함수
function renderCard(movieData) {
  const cast = movieData.credits.cast;
  console.log("CAST:", cast);
  createMovieDetail(movieData);

  //주연급 배우만 5명(변경가능) 뽑습니다. 중요도순으로 정렬되어있습니다.
  const num = cast.length > 5 ? 5 : cast.length;
  for (let i = 0; i < num; i++) {
    const castCard = createCastCard(cast[i]);
    $castContainer.appendChild(castCard);
  }
}

//cast 카드를 생성하는 함수
function createCastCard(castData) {
  const castCard = document.createElement("div");
  castCard.classList.add("movie_detail__cast");

  //카드에 들어갈 요소들 정의
  const profile = document.createElement("img");
  profile.setAttribute("src", `https://image.tmdb.org/t/p/original${castData.profile_path}`);

  const name = document.createElement("p");
  name.textContent = castData.original_name;
  name.classList.add("cast_name");

  //위에서 정의한 요소들 카드에 추가
  castCard.appendChild(profile);
  castCard.appendChild(name);

  return castCard;
}
