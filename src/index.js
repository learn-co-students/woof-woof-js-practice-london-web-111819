document.addEventListener("DOMContentLoaded", function(){
//global variables 

const baseUrl = "http://localhost:3000/pups/"
const dogBar = document.querySelector("#dog-bar")
const dogInfo = document.querySelector("#dog-info")
const goodDogsButton = document.querySelector("#good-dog-filter")

//request functions 

function get(url){
    return fetch(url)
    .then((response) => response.json())
}

function patch(url,id){
    return fetch(`${url}${id}`,{
        method:"PATCH",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bodyObject)
    }).then((response) => response.json())
    
}

//functions

function renderBar(dog){
    let span = document.createElement("span")
    span.innerText = dog.name
    span.addEventListener("click", () => showDogInfo(dog))
    dogBar.append(span)
}

function showDogInfo(dogObject){
    dogInfo.innerText = ""
    let img = document.createElement("img")
    img.src = dogObject.image
    let h2 = document.createElement("h2")
    h2.innerText = dogObject.name
    let button = document.createElement("button")
    if (dogObject.isGoodDog){
        button.innerText = "Good Dog!"
    }else{
        button.innerText = "Bad Dog!"
        
    }
    button.addEventListener("click", () => changeDogsBehaviour(dogObject.isGoodDog, dogObject.id))
    dogInfo.append(img, h2, button)
}

function changeDogsBehaviour(dogBehaviour, dogId) {
    
    if (dogBehaviour){
        bodyObject = {
            isGoodDog:false
        }
        patch(baseUrl, dogId)
        .then((dog) => showDogInfo(dog))
        .then(() => updateBarWithGoodDogs())
        
    }else{
        bodyObject = {
            isGoodDog:true
        }
        patch(baseUrl, dogId)
        .then((dog) => showDogInfo(dog))
        .then(() => updateBarWithGoodDogs())
    }
}

function updateBarWithGoodDogs(){
    if(goodDogsButton.innerText === "Filter good dogs: ON"){
        dogBar.innerText = ""
        getBarWithGoodDogs()
    }
}

function getBarWhithAllDogs(){
    get(baseUrl)
    .then((dogs) => dogs.forEach(renderBar))
}

function getBarWithGoodDogs(){
    get(baseUrl)
        .then((dogs) => dogs.filter(dog => dog.isGoodDog === true))
        .then ((goodDogs) => goodDogs.forEach(renderBar))
}

function showBarWithGoodDogs(){
    dogBar.innerText = ""
    if(event.target.innerText === "Filter good dogs: OFF"){
        event.target.innerText = "Filter good dogs: ON"
        getBarWithGoodDogs()
    }else{
        event.target.innerText = "Filter good dogs: OFF"
        getBarWhithAllDogs()
    }    
}


// event listeners and run functions 

    getBarWhithAllDogs()

    goodDogsButton.addEventListener("click", showBarWithGoodDogs)
})