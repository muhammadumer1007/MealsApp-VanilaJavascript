const mealContainer = document.getElementById('row');
let searchStr = ``
let str = ``
let FavouritesStr = ``
let search = document.getElementById('search')
let searchBtn = document.getElementById('searchBtn')
let loader = document.getElementById('loader');
let alertContainer = document.getElementById('alertContainer')
let FavouriteItemsContainer = document.getElementById('FavouriteItemsContainer')
let FavouritesContainer = document.getElementById('Favourites')
let FavouritesArrayLocastorage = JSON.parse(localStorage.getItem('Favourites'))
let FavouritesArray;

const showAlert = (msg) => {
    let toast = document.createElement('div')
    toast.setAttribute('id', 'snackbar')
    toast.setAttribute('class', 'show')
    toast.innerText = msg
    alertContainer.appendChild(toast);

    setTimeout(() => {
        alertContainer.innerHTML = ''
    }, 1500);
}

const addToFavourites = (e) => {
    if (!FavouritesArrayLocastorage) {
        localStorage.setItem('Favourites', '[]')
    }
    FavouritesArrayLocastorage = JSON.parse(localStorage.getItem('Favourites'))
    FavouritesArray = FavouritesArrayLocastorage

    if (FavouritesArray.find(i => i == e)) {
        let indexOfItem = FavouritesArray.indexOf(e)

        FavouritesArray.splice(indexOfItem, 1)
        showAlert('Removed From Favourites')
    }
    else {
        FavouritesArray.push(e)
        showAlert('Added To Favourites')
    }

    localStorage.setItem('Favourites', JSON.stringify(FavouritesArray))

    str = ``
    FetchData()
    FavouritesStr = ``
    showFavourites()
}

const showFavourites = async () => {
    if (FavouritesArrayLocastorage.length > 0) {
        FavouritesContainer.classList.remove('d-none')
        let dataFavourites;
        try {
            let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchStr}`)
            let response = await result.json()
            dataFavourites = await response.meals

            let element;
            let element1;
            let FavouritesMap = []

            for (let index = 0; index < dataFavourites.length; index++) {
                element = dataFavourites[index];

                for (let index = 0; index < FavouritesArrayLocastorage.length; index++) {
                    element1 = FavouritesArrayLocastorage[index];

                    if (element.idMeal == element1) {
                        FavouritesMap.push(
                            {
                                idMeal: element.idMeal,
                                strMealThumb: element.strMealThumb,
                                strMeal: element.strMeal,
                                strInstructions: element.strInstructions,
                                strSource: element.strSource
                            }
                        )
                    }
                }
            }

            FavouritesMap.map((e) => {
                FavouritesStr += `
                <div class="FavouriteItems" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal${e.idMeal}">
                <img src="${e.strMealThumb}" class="rounded-pill mx-1" width="120px" height="120px"
                    alt="">
                <h6 class="mt-1">${e.strMeal}</h6>
            </div>
                `
            })

            FavouriteItemsContainer.innerHTML = FavouritesStr

        } catch (error) {
            console.log(error);
        }
    }
    else {
        FavouritesContainer.classList.add('d-none')
    }

}

const FetchData = async () => {
    loader.classList.remove('d-none')

    let data;
    try {

        let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchStr}`)
        let response = await result.json()
        data = await response.meals

        loader.classList.add('d-none')

        data.map((e, i) => {

            if (FavouritesArrayLocastorage != null) {
                str += `
                <div class="col-4 col mt-3">
                <div class="card" style="width: 18rem;">
                    <img src="${e.strMealThumb}" class="card-img-top" alt="${e.strMeal}" height="250px">
                    <div class="card-body">
                        <h5 class="card-title">${e.strMeal}</h5>
                        <p class="card-text">${e.strInstructions.slice(0, 90) + '...'}</p>
                        <div class="CardBottomContainer">
                        <div class="d-flex justify-content-center">
                            <button href="#" data-bs-toggle="modal" data-bs-target="#exampleModal${e.idMeal}"
                                class="btn btn-primary">Read More</button>
                                </div>
                                <div class="d-flex justify-content-center mt-2">
            
                                <button class="btn btnHeart" onclick="addToFavourites(${e.idMeal})"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                        fill="pink" class="bi bi-heart" viewBox="0 0 16 16">
                                        <path
                                            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                    </svg> ${FavouritesArrayLocastorage.find(i => i == e.idMeal) ? 'Remove From Favourites' : 'Add To Favourites'}</button>
                            </div>
            
                            </span>
                        </div>
                    </div>
                </div>
            </div>
    
                <!-- Modal -->
                <div class="modal fade" id="exampleModal${e.idMeal}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                        <img src="${e.strMealThumb}" class="card-img-top" alt="${e.strMeal}" height="300px">
                            <div class="modal-body">
                            <h5 class="card-title">${e.strMeal}</h5>
                            ${e.strInstructions}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <a href="${e.strSource}" target="_blank" class="btn btn-primary">Original Source</a>
                            </div>
                        </div>
                    </div>
                </div>
        `
            }
            else {
                str += `
                <div class="col-4 mt-3">
                <div class="card" style="width: 18rem;">
                    <img src="${e.strMealThumb}" class="card-img-top" alt="${e.strMeal}" height="250px">
                    <div class="card-body">
                        <h5 class="card-title">${e.strMeal}</h5>
                        <p class="card-text">${e.strInstructions.slice(0, 90) + '...'}</p>
                        <div class="CardBottomContainer">
                           
                                <button href="#" data-bs-toggle="modal" data-bs-target="#exampleModal${e.idMeal}"
                                    class="btn btn-primary">Read More</button>
                        
                                    <span class="heart" onclick="addToFavourites(${e.idMeal})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    class="bi bi-heart" viewBox="0 0 16 16">
                                    <path
                                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                </div>
    
                <!-- Modal -->
                <div class="modal fade" id="exampleModal${e.idMeal}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                        <img src="${e.strMealThumb}" class="card-img-top" alt="${e.strMeal}" height="300px">
                            <div class="modal-body">
                            <h5 class="card-title">${e.strMeal}</h5>
                            ${e.strInstructions}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <a href="${e.strSource}" target="_blank" class="btn btn-primary">Original Source</a>
                            </div>
                        </div>
                    </div>
                </div>
        `
            }

        })
        mealContainer.innerHTML = str

    } catch (error) {
        console.log(error);
    }

    return data;
}

// searchBtn.addEventListener('click', () => {
//     searchStr = search.value;
//     str = ``
//     FetchData()
//     searchStr = ``
//     showFavourites()
// })
search.addEventListener('change', () => {
    searchStr = search.value;
    str = ``
    FetchData()

})

const randomMeal = async () => {
    searchStr = ``
    let mealArrayLenght = await FetchData()
    let randomMealVal = Math.floor(Math.random() * mealArrayLenght.length)

    searchStr = mealArrayLenght[randomMealVal].strMeal;
    str = ``
    FetchData()
    FavouritesStr = ``
    showFavourites()
}


FetchData()
showFavourites()