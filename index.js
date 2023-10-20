import { api } from "./tmdb.js";

const $popularArea = document.querySelector("#popular-movie");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");
const $sortBtnArea = document.querySelector("#popular-sort");

api.data.popular.then((res) => {
  // console.log(res);
  return createCard($popularArea, res);
});

const createCard = async function (parentEl, arr) {
  arr.forEach((prop, n) => {
    const tem = createCardLayout(prop);
    parentEl.insertAdjacentHTML("beforeend", tem);
    parentEl.children[n].addEventListener("click", () => {
      alert(parentEl.children[n].dataset.id);
    });
  });
};

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

const checkInclude = (obj, val) => {
  const condition = {
    ko: obj.title.includes(val),
    en: obj.original_title.toLowerCase().includes(val.toLowerCase()),
  };

  return condition.ko || condition.en;
};

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

// ========== EVENT ==========

onload = () => {
  $searchInput.focus();
};

window.addEventListener("keydown", async (e) => {
  if ($searchInput != false && e.key === "Enter") {
    searchCard(await api.data.popular, $searchInput.value, $popularArea);
  }
});

$searchInput.addEventListener("input", async (e) => {
  if (e.target.value === "") {
    searchCard(await api.data.popular, $searchInput.value, $popularArea);
  }
});

$searchBtn.addEventListener("click", async () => {
  searchCard(await api.data.popular, $searchInput.value, $popularArea);
});

$sortBtnArea.addEventListener("click", function (e) {
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove("btn-outline-active");
  }
  e.target.classList.add("btn-outline-active");
  sortCard(api.data.popular, $popularArea, e.target.dataset.sort);

  // recommendBtn.classList.remove("btn-outline-active");
  // ratingBtn.classList.remove("btn-outline-active");
  // sortCard(api.data.popular,$popularArea)
});
