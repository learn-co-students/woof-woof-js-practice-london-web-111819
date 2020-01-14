document.addEventListener("DOMContentLoaded",function(){
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
const PUPS_BASE_URL = "http://localhost:3000/pups/"
const DOGBAR = document.getElementById("dog-bar")
const DOG_SUMMARY_CONTAINER = document.getElementById("dog-summary-container")
const DOG_INFO = document.getElementById("dog-info")
const GOOD_DOG_FILTER = document.getElementById("good-dog-filter")
const EXISTING_H1 = document.querySelector("#dog-summary-container > h1")
GOOD_DOG_FILTER.classList.add("OFF")

//FUNCTIONS
function initialLoad(){
    get(PUPS_BASE_URL).then(pups=>pups.forEach(renderPupToPage))
}

function renderPupToPage(pup){
    let newSpan = document.createElement('span')
    newSpan.innerText = pup.name
    newSpan.addEventListener("click",function(event){
        populateDogSummaryContainer(pup)
    })
    DOGBAR.appendChild(newSpan)
}

function populateDogSummaryContainer(pup){
    let newImg = document.createElement('img')
    newImg.src = pup.image
    let newBreak = document.createElement('br')
    let newGoodBadButton = document.createElement('button')
    if (pup.isGoodDog) {
        newGoodBadButton.innerText = "Good Dog"
    } else {
        newGoodBadButton.innerText = "Bad Dog"
    }
    newGoodBadButton.addEventListener("click",function(event){
        toggleActions(pup,newGoodBadButton)
    })
    EXISTING_H1.innerText = pup.name
    DOG_INFO.innerHTML = ""
    DOG_INFO.append(newImg,newBreak,newGoodBadButton)
    DOG_SUMMARY_CONTAINER.append(DOG_INFO)
    
}

function toggleActions(pup,newGoodBadButton){
    //START WITH CONSTRUCTING PATCH OBJ
    let objectToSend;
    if (newGoodBadButton.innerText == "Good Dog") {
        objectToSend = {
            isGoodDog: false
        }
    } else {
        objectToSend = {
            isGoodDog: true
        }
    }
    patch(PUPS_BASE_URL,pup.id,objectToSend).then(updatedPup=>updateButton(updatedPup,newGoodBadButton))
    //CALL PATCH OBJ
    //ONCE RESPONSE RECEIVED UPDATE BUTTON
}

function updateButton(updatedpup,newGoodBadButton){
    if (newGoodBadButton.innerText == "Good Dog"){
        newGoodBadButton.innerText = "Bad Dog"
    } else {
        newGoodBadButton.innerText = "Good Dog"
    }
}

//LOADERS,EVENTLISTENERS
initialLoad()

GOOD_DOG_FILTER.addEventListener("click",function(event){
    //check if the class list includes OFF. 
    debugger
    if (event.target.classList.contains("OFF")){
        // FILTER NOW!
        DOGBAR.innerHTML=""
        get(PUPS_BASE_URL).then(pups=>pups.filter(function(pup){return pup.isGoodDog})).then(pups=>pups.forEach(renderPupToPage))
        event.target.classList.toggle("OFF")
        event.target.innerText = "Filter Good Dogs: ON"
    } else {
        // DO NOT FILTER NOW!
        DOGBAR.innerHTML=""
        initialLoad()
        event.target.classList.toggle("OFF")
        event.target.innerText = "Filter Good Dogs: OFF"
    }
})

})