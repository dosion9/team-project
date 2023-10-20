import { api } from "./tmdb.js";

const $topRatedArea = document.querySelector("#top__rated");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");

api.data.topRated.then((res) => {
  // console.log(res);
  return createCard($topRatedArea, res);
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
    <div class="card" data-id="${obj.id}" data-rating=>
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
  arr.forEach((prop, n) => {
    if (checkInclude(prop, val)) {
      parentEl.children[n].style.display = "block";
    } else {
      parentEl.children[n].style.display = "none";
    }
  });
};

const sortCard = function (arr, parentEl, type = "default") {
  arr.then((data) => {
    const byRating = [...data].sort((a, b) => b.vote_average - a.vote_average);
    parentEl.innerHTML = null;

    switch (type) {
      case "rating":
        createCard($topRatedArea, byRating);
        break;
      default:
        createCard($topRatedArea, data);
    }
  });
};

// sortCard(api.data.topRated, $topRatedArea, "rating");
// sortCard(api.data.topRated, $topRatedArea);

const checkInclude = (prop, val) => {
  const condition = {
    ko: prop.title.includes(val),
    en: prop.original_title.toLowerCase().includes(val.toLowerCase()),
  };

  return condition.ko || condition.en;
};

// ========== EVENT ==========

onload = () => {
  $searchInput.focus();
};

window.addEventListener("keydown", async (e) => {
  if ($searchInput != false && e.key === "Enter") {
    searchCard(await api.data.topRated, $searchInput.value, $topRatedArea);
  }
});

$searchInput.addEventListener("input", async (e) => {
  if (e.target.value == false) {
    searchCard(await api.data.topRated, $searchInput.value, $topRatedArea);
  }
});

$searchBtn.addEventListener("click", async () => {
  searchCard(await api.data.topRated, $searchInput.value, $topRatedArea);
});
