const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWJmOTI2NzhmMjRkMmFlZWZmODRjMmJmNGQzMzI1MyIsInN1YiI6IjY1MmYyNDY2YTgwMjM2MDBjMzE2MDZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v6FiZMMIYGmNHCWIP1tTb-1iIq22jWgA1RIijiBGVdw"
  }
};

// const api = {
//   url: {
//     popular:
//       "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1&region=KR",
//   },
//   data: {},
//   async initialize() {
//     for (const prop in this.url) {
//       this.data[prop] = getData(this.url[prop]);
//     }
//   },
// };

// async function getData(url) {
//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     return data.results;
//   } catch (error) {
//     console.log(error);
//   }
// }

// api.initialize();
// ==============================================

const url = {
  popular: "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1&region=KR"
};

const movieData = {};

async function initialize() {
  for (const prop in url) {
    movieData[prop] = await getData(url[prop]);
  }
  return movieData;
}

async function getData(url) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
}

export default initialize();
