import { api } from "./tmdb.js";

const $topRatedArea = document.querySelector("#top__rated");
const $searchInput = document.querySelector("#search__input");
const $searchBtn = document.querySelector("#search__btn");

api.data.topRated.then((res) => {
  console.log(res);
  return createCard($topRatedArea, res);
});

const createCard = async function (parentEl, arr) {
  arr.forEach((prop, n) => {
    const posterImg = `https://image.tmdb.org/t/p/original${prop.poster_path}`;

    const tem = `
    <div class="card" data-id="${prop.id}">
            <div class="card-face card-front">
                <img src="${posterImg}" alt="${prop.title} 포스터" class="card__img" />
              <div class="card__info">
              <h3 class="card__title">${prop.title}</h3>
              <p>평점 : ${prop.vote_average}</p>
              </div>
            </div>
            <div class="card-face card__back" style="display:none">
              <h5 class="card__title">${prop.title}</h5>
              <p>${prop.overview}</p>
            </div>
          </div>
    `;

    parentEl.insertAdjacentHTML("beforeend", tem);
    parentEl.children[n].addEventListener("click", () => {
      alert(parentEl.children[n].dataset.id);
    });
  });
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
