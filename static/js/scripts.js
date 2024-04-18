function getRecipes() {
  document.querySelector('.recipes').innerHTML = ``
  fetch(`api/recipes`)
    .then((response) => response.json())
    .then((recipes) => renderRecipes(recipes))
}

function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    let recipeEl = document.createElement('div')
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3><a href="detail.html?recipe=${recipe._id}">${recipe.title}</a></h3>
      <p>${recipe.description}</p>
      <button class="delete" data-id=${recipe._id} >Delete</button>
    `
    document.querySelector('.recipes').append(recipeEl)
  })
}

function addRecipe(event) {
  event.preventDefault()
  const { title, image, description } = event.target
  const recipe = {
    title: title.value,
    image: image.value,
    description: description.value,
  }

  fetch('api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then(getRecipes)
}

function importRecipes(event) {
  event.preventDefault()

  fetch('api/import', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(location.reload())
}

function deleteRecipe(event) {
  fetch(`api/recipes/${event.target.dataset.id}`, {
    method: 'DELETE',
  }).then(location.reload())
}

function deleteAllRecipes(event) {
  fetch('api/killall', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(location.reload())
}

function handleClicks(event) {
  if (event.target.matches('[data-id]')) {
    deleteRecipe(event)
  }
}

document.addEventListener('click', handleClicks)

const addForm = document.querySelector('#addForm')
addForm.addEventListener('submit', addRecipe)

document
  .querySelector('.deleteRecipes')
  .addEventListener('click', deleteAllRecipes)
document
  .querySelector('.importRecipes')
  .addEventListener('click', importRecipes)

getRecipes()
