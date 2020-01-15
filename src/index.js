document.addEventListener('DOMContentLoaded', function(){

//HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

function destroy(URI,id){
    let configObj = {
        method: "DELETE"
    }
    return fetch(`${URI}/${id}`,configObj).then(response=>response.json())
}

function post(URI,newObj){
    let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newObj)
      };
    return fetch(URI, configObj).then(response=>response.json())
}

function patch(URI,id,patchObj){
    let patchData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(patchObj)
        };
        return fetch(`${URI}${id}`,patchData).then(response=>response.json())
}
//CONSTANTS
const DOG_BAR = document.getElementById("dog-bar")
const PUPS_BASE_URL = "http://localhost:3000/pups/"
const H1_IN_DOG_SUMMARY_CONTAINER = document.querySelector("#dog-summary-container > h1")
const DOG_INFO_DIV = document.getElementById("dog-info")
const GOOD_DOG_FILTER_BUTTON = document.getElementById("good-dog-filter")

//FUNCTIONS
function loadPupsToBar(){
    get(PUPS_BASE_URL).then(showPupsInBar)
}

function showPupsInBar(pups){
    DOG_BAR.innerHTML =""
    pups.forEach(putOneOfThePupInTheBar)
}

function putOneOfThePupInTheBar(pup){
    let newSpan = document.createElement("span")
    newSpan.innerText = pup.name
    newSpan.addEventListener("click",()=>populateDogInfoWithThisPup(pup))
    DOG_BAR.appendChild(newSpan)
}

function populateDogInfoWithThisPup(pup){
    H1_IN_DOG_SUMMARY_CONTAINER.innerText = pup.name
    let newImg = document.createElement('img')
    newImg.src = pup.image
    let newH2 = document.createElement('h2')
    newH2.innerText = pup.name
    let newGoodDogBadDogButton = document.createElement('button')
    if (pup.isGoodDog) {
        newGoodDogBadDogButton.innerText = "Good Dog"
        newGoodDogBadDogButton.classList.add("GOOD")
    } else {
        newGoodDogBadDogButton.innerText = "Bad Dog"
    }
    newGoodDogBadDogButton.addEventListener("click",()=>patchDogStateAndUpdateButton(pup,newGoodDogBadDogButton))
    DOG_INFO_DIV.innerHTML = ""
    DOG_INFO_DIV.append(newImg,newH2,newGoodDogBadDogButton)
}

function patchDogStateAndUpdateButton(pup,newGoodDogBadDogButton){
    let patchObj = {
        isGoodDog: !pup.isGoodDog
    }
    patch(PUPS_BASE_URL,pup.id,patchObj).then(updateButtonText(newGoodDogBadDogButton))
}

function updateButtonText(newGoodDogBadDogButton){
    if (newGoodDogBadDogButton.classList.contains("GOOD")){
        newGoodDogBadDogButton.innerText = "Bad Dog!"
        newGoodDogBadDogButton.classList.toggle("GOOD")
    } else {
        newGoodDogBadDogButton.innerText = "Good Dog!"
        newGoodDogBadDogButton.classList.toggle("GOOD")
    }
}

function filterDogBar (event){
    if (event.target.classList.contains("OFF")) {
        event.target.classList.toggle("OFF")
        event.target.innerText = "Filter good dogs: OFF"
        loadPupsToBar()
    } else {
        event.target.classList.toggle("OFF")
        event.target.innerText = "Filter good dogs: ON"
        get(PUPS_BASE_URL).then(pups=>pups.filter(function(item){
            return item.isGoodDog
        }))
        .then(showPupsInBar)
    }

}

//INITIALLOADERS, UNRELATED EVENT LISTENERS
loadPupsToBar()
GOOD_DOG_FILTER_BUTTON.classList.add("OFF")
GOOD_DOG_FILTER_BUTTON.addEventListener("click",filterDogBar)

})