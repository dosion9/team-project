import { api } from "./tmdb.js";

const $popularArea = document.querySelector("#popular-movie");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");
const $sortBtnArea = document.querySelector("#popular-sort");

api.data.popular.then((res) => {
  // console.log(res);
  return createCard($popularArea, res);
});

/** ========== FUNCTION ==========
 * Array에 있는 영화 정보들을 Element에 카드로 생성하는 함수
 * @param {Element} parentEl 카드가 위치할 Element
 * @param {Array} arr TMDB에서 받아온 영화 목록들
 */
const createCard = function (parentEl, arr) {
  arr.forEach((prop, n) => {
    const tem = createCardLayout(prop);
    parentEl.insertAdjacentHTML("beforeend", tem);
    parentEl.children[n].addEventListener("click", () => {
      alert(parentEl.children[n].dataset.id);
    });
  });
};

/** ========== FUNCTION ==========
 * 카드 Template 생성 함수
 * @param {Object} obj 영화 정보
 * @returns 영화정보가 들어간 카드 Element
 */
const createCardLayout = (obj) => {
  const imgUrl = `https://image.tmdb.org/t/p/original${obj.poster_path}`;
  const tem = `
    <div class="card" data-id="${obj.id}">
            <div class="card__face card__face-front">
                <img src="${imgUrl}" alt="${obj.title} 포스터" class="card__img" />
              <div class="card__info">
              <h3 class="card__title">${obj.title}</h3>
              <p><b>평점</b> : ${obj.vote_average}</p>
              </div>
            </div>
            <div class="card__face card__face-back" >
              <h4 class="card__title">${obj.title}</h4>
              <p>${obj.overview}</p>
            </div>
          </div>
    `;

  return tem;
};

/** ========== FUNCTION ==========
 * input에 입력한 값을 가지고 카드의 display를 조작하는 함수
 * @param {Array} arr TMDB에서 받아온 영화 목록들
 * @param {String} val Input Value
 * @param {Element} parentEl 카드가 위치한 Element
 */
const searchCard = function (arr, val, parentEl) {
  // 배열 그대로 가져다 만든 추천순 cardList에선 작동하지만
  // 배열이 변경된 평점순에선 제대로 동작하지 않는다.
  // arr.forEach((prop, n) => {
  //   if (checkInclude(prop, val)) {
  //     parentEl.children[n].style.display = "block";
  //   } else {
  //     parentEl.children[n].style.display = "none";
  //   }
  // });

  const result = arr.filter((n) => checkInclude(n, val));

  for (let i = 0; i < parentEl.children.length; i++) {
    const id = parentEl.children[i].dataset.id;
    const index = result.findIndex((n) => {
      return n.id == id;
    });
    if (index !== -1) {
      parentEl.children[i].style.display = "block";
    } else {
      parentEl.children[i].style.display = "none";
    }
  }
};

/** ========== FUNCTION ==========
 * input에 입력된 값이 영화 제목에 포함되어있는지 확인하는 함수
 * @param {Object} obj 영화 정보
 * @param {String} val Input Value
 * @returns {Boolean} true : 포함 O | false : 포함 X
 */
const checkInclude = (obj, val) => {
  const condition = {
    ko: obj.title.includes(val),
    en: obj.original_title.toLowerCase().includes(val.toLowerCase()),
  };

  return condition.ko || condition.en;
};

/** ========== FUNCTION ==========
 * dataset을 통해 받은 type으로 카드들을 정렬하는 함수
 * @param {Array} arr TMDB에서 받아온 영화 목록들
 * @param {Element} parentEl 카드들이 위치한 Parent Element
 * @param {String} type 정렬할 방법(button의 dataset에 type지정)
 */
const sortCard = function (arr, parentEl, type = "default") {
  arr.then((data) => {
    const byRating = [...data].sort((a, b) => b.vote_average - a.vote_average);
    parentEl.innerHTML = null;

    switch (type) {
      case "rating":
        createCard($popularArea, byRating);
        break;
      default:
        createCard($popularArea, data);
    }
  });
};

/** ========== EVENT ==========
 * 로딩 시 검색창으로 포커스 해주는 이벤트
 */
onload = () => {
  $searchInput.focus();
};

/** ========== EVENT ==========
 * 검색창에 입력된 텍스트가 들어가는 영화 카드를 엔터키로 찾는 이벤트
 */
window.addEventListener("keyup", async (e) => {
  if ($searchInput != false && e.key === "Enter") {
    searchCard(await api.data.popular, $searchInput.value, $popularArea);
  }
});

/** ========== EVENT ==========
 * 검색창이 공백일 때 모든 카드를 보여주는 이벤트
 */
$searchInput.addEventListener("input", async (e) => {
  if (e.target.value === "") {
    searchCard(await api.data.popular, $searchInput.value, $popularArea);
  }
});

/** ========== EVENT ==========
 * 검색창에 입력된 텍스트가 들어가는 영화 카드를 검색 버튼으로 찾는 이벤트
 */
$searchBtn.addEventListener("click", async () => {
  searchCard(await api.data.popular, $searchInput.value, $popularArea);
});

/** ========== EVENT ==========
 * "**순" 버튼을 눌렀을 시 그에 맞게 카드 정렬을 하는 이벤트
 */
$sortBtnArea.addEventListener("click", function (e) {
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove("btn-outline-active");
  }
  e.target.classList.add("btn-outline-active");
  sortCard(api.data.popular, $popularArea, e.target.dataset.sort);
});
