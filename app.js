const searchBtn = document.getElementById('search-btn'),
      searchInput = document.getElementById('search-input'),
      mealList = document.getElementById('meal-list'),
      mealItems = document.querySelectorAll('.meal__item'),
      overlayDetail = document.querySelector('.meal__overlay'),
      meaDetail = document.querySelector('.meal__detail'),
      meaDetailContent = document.querySelector('.meal__content'),
      closeBtn = document.getElementById('recipe-close-btn');

// event listener
// 1. click searchBtn or press Enter
searchBtn.addEventListener('click', getMealList);

searchInput.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    e.preventDefault();
    searchBtn.click();
  }
})

// 2. click btn to get recipe
// mealList.addEventListener('click', getRecipe)
mealList.addEventListener('click', getRecipe)


closeBtn.addEventListener('click', () => {
  meaDetail.classList.remove('showRecipe');
  overlayDetail.style.display = 'none';
})


// handle event
function getMealList() {
  let searchInputTxt = document.getElementById('search-input').value.trim();

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      let listMealHTML = '';
      if (data.meals) {
        mealList.classList.remove('notFound');
        data.meals.forEach(meal => {
          listMealHTML += `<div class="meal__item" data-id="${meal.idMeal}">
                      <div class="meal__img">
                        <img src="${meal.strMealThumb}" alt="food">
                      </div>
                      <div class="meal__name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe__btn">Get Recipe</a>
                      </div>
                    </div>`;

        });
      }
      else {
        mealList.classList.add('notFound');
        listMealHTML = "Sorry, We didn't find any meals ..."
      }
      mealList.innerHTML = listMealHTML;
    })
}


function getRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe__btn')) {
    let mealItem = e.target.parentElement.parentElement;
    let dataIdMeal = mealItem.getAttribute('data-id')

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dataIdMeal}`)
      .then(response => response.json())
      .then(data => mealRecipeModal(data.meals[0]))
      .catch(err => {
        alert("Can't find anything about recipe !!!");
      })
  }
}


function mealRecipeModal(mealInfo) {
  let htmlMealDetails = ` 
                            <h2 class="recipe__title">${mealInfo.strMeal}</h2>
                            <p class="recipe__category">${mealInfo.strCategory}</p>
                            <div class="recipe__instruct">
                              <h3>Instructions</h3>
                              <p>${mealInfo.strInstructions}</p>
                            </div>
                            <div class="recipe__img">
                              <img src="${mealInfo.strMealThumb}" alt="Food">
                            </div>
                            <div class="recipe__link">
                              <a href="${mealInfo.strYoutube}" target="_blank">Watch Video</a>
                            </div>`;

  meaDetailContent.innerHTML += htmlMealDetails;
  meaDetail.classList.add('showRecipe');
  overlayDetail.style.display = 'block';
}