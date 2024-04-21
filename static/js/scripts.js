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
      <p>${setDate(recipe.created)}</p>
      <p>${recipe.description}</p>
      <p>${
        recipe.ingredients && recipe.ingredients.length > 0
          ? 'Ingredients: '
          : ''
      } ${setIngredients(recipe.ingredients)}</p>
      <p><ul>${setPreparation(recipe.preparation)}</ul></p>
      <button class="delete" data-id=${recipe._id} >Delete</button>
    `
    document.querySelector('.recipes').append(recipeEl)
  })
}

function addRecipe(event) {
  event.preventDefault()
  const { title, created, image, description, ingredients } = event.target
  const preparationSteps = []
  const stepInputs = document.querySelectorAll('#preparationSteps input')
  stepInputs.forEach((input) => {
    preparationSteps.push({ step: input.value.trim() })
  })

  const recipe = {
    title: title.value,
    created: created.value,
    image: image.value,
    description: description.value,
    ingredients: ingredients.value,
    preparation: preparationSteps,
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
    .then(location.reload())
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

function uploadImage(event) {
  event.preventDefault()
  const data = new FormData()
  data.append('file', imageForm.file.files[0])
  data.append('filename', imageForm.filename.value)
  fetch('/api/upload', {
    method: 'POST',
    body: data,
  })
    .then((success) => {
      console.log(success) // Handle the success response object
      if (success.status === 200) {
        document.querySelector('.message').append(`The image has been uploaded`)
      }
    })
    .catch(
      (error) => console.log(error) // Handle the error response object
    )
}

// function formatDateToAddRecipe(value) {
//   alert(value)
//   const parts = value.split('-')
//   const year = parts[0]
//   const month = parts[1]
//   const day = parts[2]
//   alert(day)
//   const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(
//     2,
//     '0'
//   )}T00:00:00.000Z`
//   return isoDateString
// }
//convert 04/21/2024 to 2024-04-21T14:04:38.656Z
// function convertDatePickerValue(datePickerValue) {
//   const date = new Date(datePickerValue + 'T00:00:00') // Ensure it's set to midnight for consistency

//   const year = date.getUTCFullYear()
//   const month = ('0' + (date.getUTCMonth() + 1)).slice(-2) // Months are 0-indexed
//   const day = ('0' + date.getUTCDate()).slice(-2)
//   const hours = ('0' + date.getUTCHours()).slice(-2)
//   const minutes = ('0' + date.getUTCMinutes()).slice(-2)
//   const seconds = ('0' + date.getUTCSeconds()).slice(-2)
//   const milliseconds = ('00' + date.getUTCMilliseconds()).slice(-3)

//   const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`

//   console.log(formattedDate)

//   return formattedDate
// }

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
  //console.log(formattedDate)
  return formattedDate
}

// function setDate(value) {
//   console.log(value)
//   const monthsOfYear = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ]

//   let time = new Date(value),
//     formattedDate,
//     formattedTime

//   let hours = time.getHours()
//   let ampm = hours >= 12 ? 'PM' : 'AM' // Determine if it's AM or PM
//   hours = hours % 12
//   hours = hours ? hours : 12 // Convert midnight (0 hours) to 12

//   formattedDate =
//     monthsOfYear[time.getMonth()] +
//     ' ' +
//     (time.getDate() + 1) +
//     ', ' +
//     time.getFullYear()

//   console.log(time.getDate())

//   formattedTime = `${hours}:${time
//     .getMinutes()
//     .toString()
//     .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')} ${ampm}`

//   return `${formattedDate} ${formattedTime}`
// }
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
// add Step button for addForm
const addStepButton = document.getElementById('addStep')
const preparationContainer = document.getElementById('preparationSteps')
let stepCount = 1

addStepButton.addEventListener('click', function () {
  const stepInput = document.createElement('input')
  stepInput.type = 'text'
  stepInput.placeholder = 'Step ' + stepCount
  stepInput.name = 'step' + stepCount
  stepInput.value = ''
  preparationContainer.appendChild(stepInput)

  stepCount++
})

const imageForm = document.querySelector('#imageForm')
imageForm.addEventListener('submit', uploadImage)

document.addEventListener('click', handleClicks)

const addForm = document.querySelector('#addForm')
addForm.addEventListener('submit', addRecipe)

document
  .querySelector('.deleteRecipes')
  .addEventListener('click', deleteAllRecipes)
document
  .querySelector('.importRecipes')
  .addEventListener('click', importRecipes)

const startDateInput = document.querySelector('#start')
const currentDate = new Date()
const currentDateString = currentDate.toISOString().split('T')[0]
startDateInput.value = currentDateString

getRecipes()
