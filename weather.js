const userTab = document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.getElementsByClassName("weather-container");
const grantAccessContainer=document.getElementsByClassName("grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-conatiner");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY="f4464b75536fdd010ca1ac1d4f1e1eda";
oldTab.classList.add("current-tab");
oldTab=userTab;
getfromSessionStorage();

function switchTab(newTab){
    if(newTab != oldTab)
    {
        oldTab.classList.remove("currentTab");
        oldTab=newTab;
        oldTab.classList.add("active");
        if(!searchForm.classList.contains("active"))
        {
            //kya search form wala container is invisible , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab pr tha, ab your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab mei aagya hu , toh weather bhi display karna pdega, so let's check local storage first
            //for coordinates , if we have saved them there
             getfromSessionStorage();  
        }
    }
    
}
userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
     //pass clicked tab as input parameter
     switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates)
    {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const cordinates = JSON.parse(localcoordinates);
        fetchUserWeatherInfo(cordinates);
    }
}
async function  fetchUserWeatherInfo(coordinates) {
    const{lat,lon} = coordinates;
    //make grantContainer invisible
    grantAccessButton.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        console.log("ERROR, Please type a valid place.");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly ,  we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherInfo object and put it UI elements

    cityName.innerText = weatherInfo?.name;

}

