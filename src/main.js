import { getMovieFromTmdb } from "./api.js";

// ==================== DOM ====================
const $popularCardArea = document.querySelector("#movieList-popular");
const $upcomingCardArea = document.querySelector("#movieList-upcoming");
const $sortBtnArea = document.querySelector("#popular-sort");
const $sortBtnDefault = $sortBtnArea.children[0];
const $sortBtnRating = $sortBtnArea.children[1];

// ==================== CODE ====================
const snapShotPopularDefault = await getMovieFromTmdb({ type: "popular" });
const snapShotPopularRating = [...snapShotPopularDefault].sort((a, b) => {
  return b.vote_average - a.vote_average;
});
const snapShotUpcoming = await getMovieFromTmdb({ type: "upcoming" });
const cardInstance = {
  popularDefault: [],
  popularRating: [],
  upcoming: []
};

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
      : "../assets/img/noImg.jpg";
    const layout = `
                    <div class="card " data-id="${this.id}">
                            <div class="card__face card__face-front">
                                <img src="${imgUrl}" alt="${this.title} 포스터" class="card__img" 
    onerror="this.onerror=null; this.src='../assets/img/noImg.jpg'" />
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
  toggleCard(boolean) {
    boolean ? this.el.classList.add("card-active") : this.el.classList.remove("card-active");
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

// Card 인스턴스를 한번에 토글하는 함수
function toggleCardAll(arr, boolean) {
  arr.forEach((n) => {
    n.toggleCard(boolean);
  });
}

snapShotPopularDefault.forEach((n) => {
  const card = new MovieCard(n);
  cardInstance.popularDefault.push(card);
  card.createCard($popularCardArea);
  card.toggleCard(true);
  card.addEvent();
});

snapShotPopularRating.forEach((n) => {
  const card = new MovieCard(n);
  cardInstance.popularRating.push(card);
  card.createCard($popularCardArea);
  card.toggleCard(false);
  card.addEvent();
});

snapShotUpcoming.forEach((n) => {
  const card = new MovieCard(n);
  cardInstance.upcoming.push(card);
  card.createCard($upcomingCardArea);
  card.toggleCard(true);
  card.addEvent();
});

//==================== EVENT ====================
// 추천순 정렬 이벤트
$sortBtnDefault.addEventListener("click", (e) => {
  for (let i = 0; i < $sortBtnArea.children.length; i++) {
    $sortBtnArea.children[i].classList.remove("btn-outline-active");
  }
  e.target.classList.add("btn-outline-active");
  toggleCardAll(cardInstance.popularRating, false);
  toggleCardAll(cardInstance.popularDefault, true);
});

// 평점순 정렬 이벤트
$sortBtnRating.addEventListener("click", (e) => {
  for (let i = 0; i < $sortBtnArea.children.length; i++) {
    $sortBtnArea.children[i].classList.remove("btn-outline-active");
  }
  e.target.classList.add("btn-outline-active");
  toggleCardAll(cardInstance.popularDefault, false);
  toggleCardAll(cardInstance.popularRating, true);
});
