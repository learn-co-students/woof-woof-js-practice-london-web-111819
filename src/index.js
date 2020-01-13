// GLOBAL VARIABLES / CONSTANTS
const baseURI = 'http://localhost:3000/pups/'
const dogBar = document.querySelector('#dog-bar')
const dogInfo = document.querySelector('#dog-info')
const dogFilter = document.querySelector('#good-dog-filter')

// API FUNCTIONS
function get(url) {
    return fetch(url)
    .then(function(response) {
        return response.json()
    })
}

function show(url, id) {
    return fetch(`${url}${id}`)
    .then(function(response) {
        return response.json()
    })
}

function patch(url, id, bodyObject) {
    return fetch(`${url}${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bodyObject)
    })
    .then(function(response) {
       return response.json()
    })
}

// FUNCTIONS
function createDogCard(dog) {
    let dogName = document.createElement('span')
    dogName.textContent = dog.name
    dogName.id = dog.id
    dogBar.appendChild(dogName)
    dogName.addEventListener('click', function(event) {
        getSelectedDogAndShowCard(event.target.id)
    })
}

function createDogShowPanel(dog) {
    let img = document.createElement('img')
    img.src = dog.image
    let h2 = document.createElement('h2')
    h2.textContent = dog.name
    let goodDogBtn = document.createElement('button')
    dog.isGoodDog === true ? goodDogBtn.textContent = 'Bad Dog' : goodDogBtn.textContent = 'Good Dog'
    dogInfo.append(img, h2, goodDogBtn)
    dogInfo.setAttribute('data-id', dog.id)
    goodDogBtn.addEventListener('click', function(event) {
        if (goodDogBtn.textContent === 'Bad Dog') {
            changeIsBadDogStatus(event.target.parentElement.dataset.id)
            goodDogBtn.textContent = 'Good Dog'
    }   else {
            changeIsGoodDogStatus(event.target.parentElement.dataset.id)
            goodDogBtn.textContent = 'Bad Dog'
    }})
}

function getAllDogsAndRenderCard() {
    get(baseURI)
    .then(function(dogs) {
        dogs.forEach(createDogCard)
    })
}

function getSelectedDogAndShowCard(id) {
    show(baseURI, id)
    .then(function(dog) {
        dogInfo.innerHTML = ''
        createDogShowPanel(dog)
    })
}

function filterByGoodDogs() {
    get(baseURI)
    .then(function(dogs) {
        let goodDogs = dogs.filter(function(dog) {
            return dog.isGoodDog === true
        })
        dogBar.innerHTML = ''
        goodDogs.forEach(createDogCard)
    })
}

function changeIsBadDogStatus(id) {
    let bodyObject = {
        isGoodDog: false
    }
    patch(baseURI, id, bodyObject)
}

function changeIsGoodDogStatus(id) {
    let bodyObject = {
        isGoodDog: true
    }
    patch(baseURI, id, bodyObject)
}



// EVENT LISTENER
document.body.onload = getAllDogsAndRenderCard
dogFilter.addEventListener('click', function(event) {
   if (event.target.innerHTML === 'Filter good dogs: OFF') {
       event.target.innerHTML = 'Filter good dogs: ON'
       filterByGoodDogs()
   } else {
       dogBar.innerHTML = ''
       getAllDogsAndRenderCard()
       event.target.innerHTML = 'Filter good dogs: OFF'
   }
})