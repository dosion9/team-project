// 영화의 상세정보를 가지고 여러가지 하는 파일

const $dataContainer = document.querySelector(".container__detail");
const $castContainer = document.querySelector(".container__cast");
let movieId = 926393; // 이부분은 나중에 쿼리 스트링에서 따오는 값으로 동적으로 변경
const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=ko-ko`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzUxODEzMGMyNmQyNDk3MTQzMzI0ZDE2ZmQ5ZmRjMiIsInN1YiI6IjY1MmYzMGEzZWE4NGM3MDBjYTEyYWYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MDJteH71TG0WQ7joW6cLBTmEwqEvkwDjud9DOqQ3WnQ"
  }
};

async function initialize() {
  let movieData = await getData(url);
  console.log(movieData);
  console.log(movieData.overview);
  const movTitle = movieData.title;
  const movOverview = movieData.overview;
  console.log(movTitle);
  console.log(movOverview);
  console.log(movieData.credits.cast[0].name);
  renderCard(movieData);
}
initialize();

async function getData(url) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

//movie detail 카드를 생성하는 함수
function createMovieDetail(movieData) {
  //   const card = document.createElement("div");
  //   card.classList.add("movie_detail__detail");

  //카드에 들어갈 요소들 정의
  const poster = document.createElement("img");
  poster.setAttribute("src", `https://image.tmdb.org/t/p/w300${movieData.poster_path}`);

  const title = document.createElement("h3");
  title.textContent = movieData.title;
  title.classList.add("detail__title");

  const overview = document.createElement("p");
  overview.textContent = movieData.overview;
  overview.classList.add("detail__overview");

  const releaseDate = document.createElement("p");
  releaseDate.textContent = movieData.release_date;
  //위에서 정의한 요소들 카드에 추가
  $dataContainer.appendChild(poster);
  $dataContainer.appendChild(title);
  $dataContainer.appendChild(overview);
  $dataContainer.appendChild(releaseDate);
}
//생성한 디테일을 화면에 뿌리는 함수
function renderCard(movieData) {
  const cast = movieData.credits.cast;
  console.log(cast);
  createMovieDetail(movieData);

  for (let i = 0; i < 5; i++) {
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
  profile.setAttribute("src", `https://image.tmdb.org/t/p/w200${castData.profile_path}`);

  const name = document.createElement("p");
  name.textContent = castData.original_name;

  //위에서 정의한 요소들 카드에 추가
  castCard.appendChild(profile);
  castCard.appendChild(name);

  return castCard;
}

//   fetch('https://api.themoviedb.org/3/movie/51608?append_to_response=credits&language=ko-ko', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

//배우 이름은 영어로 검색하되, 언어설정은 한국어로 해주면 된다. 근데 한국어로 검색해도 original name이 영어인게 낭패네

// function searchUrlParam(key) {
//     return new URLSearchParams(window.location.search).get(key);
//     }
