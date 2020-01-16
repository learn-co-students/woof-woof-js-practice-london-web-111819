document.addEventListener("DOMContentLoaded", () => {
    const pupsUrl = "http://localhost:3000/pups/"
    const dogBar = document.querySelector('#dog-bar')
    const dogInfo = document.querySelector('#dog-info')
    const filterDiv = document.querySelector('#filter-div')

    const getPups = () => 
        fetch(pupsUrl)
        .then(response => response.json())
        .then(data => {
            renderPup(data)
        })

    const renderPup = data => {
        data.map(pup => {
            const span = document.createElement('span')
            span.textContent = pup.name
            span.addEventListener("click", () => 
                showPup(pup)
            )
            dogBar.append(span)
        })
    }

    const showPup = pup => {
        dogInfo.innerHTML = null
        const img = document.createElement('img')
        img.setAttribute("src", pup.image)
        const name = document.createElement('h2')
        name.innerHTML = pup.name
        const button = document.createElement('button')
        toggleButtonText(pup, button)
        button.addEventListener("click", () => 
            pupButtonHandler(pup, button)
        )
        dogInfo.append(img, name, button)
    }

    const toggleButtonText = (pup, button) => {
        if (pup.isGoodDog) {
            button.innerText = "Good Dog!"
        } else {
            button.innerText = "Bad Dog!"
        }
    }

    const pupButtonHandler = (pup, button) => {
        if (pup.isGoodDog) {
            pup.isGoodDog = false
        } else {
            pup.isGoodDog = true
        }
        toggleButtonText(pup, button)
        updatePup(pup)
    }

    const updatePup = (pup) => {
        fetch(`${pupsUrl}${pup.id}`, patchConfig(pup))
        .then(response => response.json())
    }

    const patchConfig = (pup) => {
        return {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(pup)
        }
    }

    // --------------- not working as intended but im moving on ----------

    // const filterPups = () => {
    //     const filterButton = document.querySelector('#good-dog-filter')
    //     filterButton.addEventListener("click", () => {
    //         let onOff = filterButton.innerText.split(': ')[1]
    //         if (onOff === "OFF") {
    //             filterButton.innerText = "Filter good dogs: ON"
    //         } else if (onOff === "ON") {
    //             filterButton.innerText = "Filter good dogs: OFF"
    //             fetch(pupsUrl).then(response => response.json())
    //             .then(pups => {
    //                 return pups.filter( pup => pup.isGoodDog )
    //             })
    //             .then(data => {
    //                 dogBar.innerHTML = null
    //                 renderPup(data)
    //             })
    //         }
    //     })
    // }

    document.body.onload = getPups()
    // filterPups()
})