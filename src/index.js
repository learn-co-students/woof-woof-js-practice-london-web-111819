document.addEventListener("DOMContentLoaded", () => {


// api functions

function get(url) {
    return fetch(url).then(resp => resp.json())
}

function patch(url, id, bodyObject) {
    return fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
      },
      body: JSON.stringify(bodyObject)
    })
        .then(resp => resp.json())
  }


 //Consts / Globals

const dogBar = document.querySelector('#dog-bar')
const baseUrl = 'http://localhost:3000/pups'
const dogInfo = document.querySelector('#dog-info')
// const buttonToggle = document.querySelector('.button')


// functions

function createDoglist(dog){
    let span = document.createElement('span')
    span.innerText = dog.name
    span.addEventListener('click', () => (showDogInfo(dog)))
    dogBar.append(span)
}

function showDogInfo(dog) {
    while (dogInfo.firstChild) dogInfo.removeChild(dogInfo.firstChild)

    let img = document.createElement('img')
    img.src = dog.image
    img.className = 'dog-image'

    let h2 = document.createElement('h2')
    h2.innerText = dog.name

    let p = document.createElement('p')
    p.innerText = dog.likes

    let likeButton = document.createElement('button')
    likeButton.className = 'like-btn'
    likeButton.innerText = 'like<3'
    debugger
    likeButton.addEventListener('click',  () => patchAndUpdateLikes(dog, p))

    const dogButton = document.createElement("button")
    dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    dogButton.dataset.id = dog.id
    dogButton.addEventListener("click", (e) => onGoodDogButtonClick(e, dog))
    
    dogInfo.append(img, h2, p, likeButton, dogButton)
}


function getAndRenderDogs() {
    get(baseUrl).then(dogs => dogs.forEach(createDoglist))
}

function onGoodDogButtonClick(e, dog){
    let newValue;
    if (e.target.innerText.includes("Good")){
        
        newValue = false
        bodyObject = {isGoodDog: newValue} 
        patch(baseUrl, dog.id, bodyObject)
        .then(e.target.innerText = "Bad Dog!") 
      
    } else {
        newValue = true

        bodyObject = {isGoodDog: newValue} 

        patch(baseUrl, dog.id, bodyObject)
        .then(e.target.innerText = "Good Dog!") 
    }
       
}

function patchAndUpdateLikes(dog, likesElement) {
    let bodyObject = {
        likes: parseInt(likesElement.innerText) + 1
    }
    patch(baseUrl, dog.id, bodyObject)
    likesElement.innerText = dog.likes
}

document.body.onload = getAndRenderDogs()

})