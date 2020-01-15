document.addEventListener("DOMContentLoaded", function() {
//constants
const baseUrl = "http://localhost:3000/pups/"
const dogsIndex = document.querySelector("#dog-bar")
const dogShow = document.querySelector("#dog-info")
const filterBtn = document.querySelector("#good-dog-filter")

//functions

function get(url) {
  return fetch(url)
  .then(resp => resp.json())
}

function patch(url, id, obj) {
 return fetch(`${url}${id}`, {
     method: "PATCH",
     headers: {"Content-Type": "application/json",
               "Accept": "application/json"},
     body: JSON.stringify(obj)          
 })
 .then(resp => resp.json())
 
}

function getDogs(){
  get(baseUrl)
  .then(dogs => dogs.forEach(renderDogs))
}

function renderDogs(dog) {
  
    let newSpan = document.createElement("span")
    newSpan.innerText = dog.name
    dogsIndex.appendChild(newSpan)
    newSpan.addEventListener("click", () => renderDog(dog))
  
}

function renderDog(dog){
  dogShow.innerText = ""

  let img = document.createElement("img")
  img.src = dog.image
  let name = document.createElement("h2")
  name.innerText = dog.name
  let behaviourBtn = document.createElement("button")
   
  if (dog.isGoodDog) {
  behaviourBtn.innerText = "good dog"
  } else {
      behaviourBtn.innerText = "bad dog"
  }

  dogShow.append(img, name, behaviourBtn);

  behaviourBtn.addEventListener("click", () => patchDog(dog))

}

function patchDog(dog) {
    // const bodyObj = {}
    if (dog.isGoodDog) {
    bodyObj = {
        isGoodDog: false
    }
    
  }  
  else {
      bodyObj = {
          isGoodDog: true
      }
      
  }
    patch(baseUrl, dog.id, bodyObj)
    .then(dog => renderDog(dog));
}

function showGoodDogs(e) {
    dogsIndex.innerText = ""
    if (e.target.innerText === "Filter good dogs: OFF") {
        e.target.innerText = "Filter good dogs: ON"
        get(baseUrl)
        .then((dogs) => dogs.filter(dog => dog.isGoodDog === true))
        .then(goodDogs => goodDogs.forEach(renderDogs))
    } else {
        e.target.innerText = "Filter good dogs: OFF"
        getDogs()
    }
}













getDogs();

filterBtn.addEventListener("click", showGoodDogs)

});
