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
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.ineerText = weatherInfo?.weather?.[0].description;
    weatherIcon.src=` http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}  °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}% `;
    cloudiness.innerText=`${weatherinfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geo-location support available:(");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude, 
    }
    //co-relate this with line 50!!
     sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    
    if(city === "")
    {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        alert("No geo-location support available:(");
    }
}



