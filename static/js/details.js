function showDetail() {
  const urlParams = new URLSearchParams(window.location.search)
  const recipeId = urlParams.get('recipe')

  fetch(`api/recipes/${recipeId}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((recipe) => renderRecipe(recipe))
}

function renderRecipe(recipe) {
  const { image, title, created, description, ingredients, preparation } =
    recipe
  let recipeEl = document.createElement('div')
  recipeEl.innerHTML = `
    <img src="img/${image}" />
    <h3>${title}</h3>
    <p>${setDate(created)}</p>
    <p>${description}</p>
    <p>${setIngredients(ingredients)}</p>
    <ul>${setPreparation(preparation)}</ul>
    <a href="/">Back</a>
    `

  editForm.title.value = title
  editForm.created.value = formatDate(created)
  editForm.image.value = image
  editForm.description.value = description
  editForm.ingredients.value = ingredients

  // Clear existing preparation input fields
  document.querySelector('#preparationList').innerHTML = ''
  // Add input fields for preparation steps
  preparation.forEach((step, index) => {
    const stepInput = document.createElement('input')
    stepInput.type = 'text'
    stepInput.placeholder = 'Step ' + (index + 1)
    stepInput.name = 'step' + (index + 1)
    stepInput.value = step.step
    document.querySelector('#preparationList').appendChild(stepInput)
  })
  //console.log(editForm)
  document.querySelector('.recipe').append(recipeEl)
}

const updateRecipe = (event) => {
  event.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  const recipeId = urlParams.get('recipe')
  const { title, created, image, description, ingredients, preparation } =
    event.target
  const updatedRecipe = {
    _id: recipeId,
    title: title.value,
    created: created.value,
    image: image.value,
    description: description.value,
    ingredients: ingredients.value,
    preparation: prepare(),
  }
  fetch(`api/recipes/${recipeId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedRecipe),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(showDetail)
    .then(location.reload())
}
//format date of datepicker
function formatDate(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

//display date in the list, convert 2024-04-21T14:04:38.656Z to April 21, 2024 4:38pm
function setDate(value) {
  const dateString = value
  const date = new Date(dateString)

  date.setDate(date.getDate())

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  // console.log(formattedDate)
  return formattedDate
}
function setIngredients(value) {
  return value
    .map((item) => {
      return item
    })
    .join(', ')
}

function setPreparation(value) {
  return value.map((item, index) => {
    return `<li>Step ${index + 1}: ${item.step}</li>`
  })
}
//display 'preparation' in the edit form
function prepare() {
  const preparation = []
  const stepInputs = document.querySelectorAll('input[name^="step"]')
  stepInputs.forEach((input) => {
    const stepValue = input.value.trim()
    if (stepValue !== '') {
      preparation.push({ step: stepValue })
    }
  })
  return preparation
}

const editForm = document.querySelector('#editForm')
editForm.addEventListener('submit', updateRecipe)

showDetail()
