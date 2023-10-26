const koficApi = {
  baseUrl: "http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json",
  params: {
    key: "d268510436f3bd7a4d224f272399d612",
    // openStartDt: 1990, // YYYY형식의 조회시작 개봉연도
    itemPerPage: 12, // 페이지 당 아이템 개수
    movieTypeCd: 220101 // 영화 타입 (장편)
  }
};

const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWJmOTI2NzhmMjRkMmFlZWZmODRjMmJmNGQzMzI1MyIsInN1YiI6IjY1MmYyNDY2YTgwMjM2MDBjMzE2MDZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v6FiZMMIYGmNHCWIP1tTb-1iIq22jWgA1RIijiBGVdw"
  }
};

async function getMovieFromKofic(searchStr, pageNum = 1) {
  const params = new URLSearchParams(Object.entries({ ...koficApi.params, movieNm: searchStr, curPage: pageNum }));
  const url = `${koficApi.baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const result = {
      movieList: data.movieListResult.movieList,
      totalMovieCount: data.movieListResult.totCnt,
      nextPage: pageNum + 1
    };
    return result;
  } catch (err) {
    console.error(err);
  }
}
// const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&primary_release_year=${year}&language=ko-KR&page=1&region=KR`;

async function getMovieFromTmdb(title, year) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=ko-KR&page=1&region=KR`;
  try {
    const response = await fetch(url, tmdbOptions);
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error(err);
  }
}

export { getMovieFromKofic, getMovieFromTmdb };
