async function setRenderBackground() {
    const result = await axios.get("https://picsum.photos/2560/1440", {
        responseType: "blob"
    }
    )

    const data = URL.createObjectURL(result.data)
    console.log(data)
    document.querySelector("body").style.backgroundImage = `url(${data})`
}
function pluszero(value) {
    if (value < 10) {
        return "0" + value;
    }
    else {
        return value;
    }
}
function setTime() {
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //     console.log(pos)
    // })
    const timer = document.querySelector(".timer");
    setInterval(() => {

        const hour = new Date().getHours();
        const minute = new Date().getMinutes()
        const second = new Date().getSeconds();
        timer.textContent = `${pluszero(hour)}:${pluszero(minute)}:${pluszero(second)}`
    }, 1000);



}


function getMemo(value) {
    const memo = document.querySelector(".memo")
    const memoValue = localStorage.getItem("todo")
    memo.textContent = value
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input")
    memoInput.addEventListener("keyup", function (e) {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.target.value)
            getMemo(e.target.value)
            memoInput.value = ""
        }

    })
}

function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo")
            e.target.textContent = ""
        }
    })
}
// latitude: 35.1895552, longitude: 126.81216


function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

async function getWeather(lat, lon) {
    console.log(lat, lon)

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bfc017b2336417f001e96e18c2ff4330`)
        return data
    }
    const data = await axios.get(`http://api.openweather.org/data/2.5/forecast?q=seoul&appid=bfc017b2336417f001e96e18c2ff4330`)
    return data


}


async function renderWeather() {
    let latitude = ""
    let longitude = "";

    try {
        const position = await getPosition();
        console.log(position)
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch {

    }
    const result = await getWeather(latitude, longitude)
    const weatherData = result.data;
    console.log(weatherData)

    const weatherList = weatherData.list.reduce((acc, cur) => {
        if ((cur.dt_txt.indexOf("18:00:00") > 0)) {
            acc.push(cur)
        }
        return acc;
    }, [])
    console.log(weatherList)
    const modalBody = document.querySelector(".modal-body")
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    })
}

function weatherWrapperComponent(e) {
    // const TopWeatherIcon = document.querySelector("weather-icon2")

    const changeToCelcius = (temp) => ((temp - 32) * 5 % 9).toFixed(1)
    return `
    <div class="card" style="width:18rem;">
        <div class="card-header text-red text-center">
            #${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body">
            <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top">
                <p class="card-text">${changeToCelcius(e.main.temp)}</p>
        </div>
    </div>
    `
}
function EvMo() {
    const hour = new Date().getHours();
    if (hour < 13) {
        return 'Morning'
    }
    else {
        return 'Evening'
    }



}

async function MornEve() {
    const timerWapper = document.querySelector(".EvMo")
    timerWapper.innerHTML = `<div div class="timer-content" > Good ${EvMo()}, Positive!</div > `
    return 0;

}

// function TopWeather() {
//     const TopWeatherIcon = document.querySelector(".weather")
//     TopWeatherIcon.innerHTML =
//         `< div class = "weather-body" >
//             <img src = "${matchIcon(e.weather[0].main)}" >
//         </>`
//     return 0;
// }

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "/images/039-sun.png"
    if (weatherData === "Clouds") return "/images/001-cloud.png"
    if (weatherData === "Rain") return "/images/003-rainy.png"
    if (weatherData === "Snow") return "/images/006-snowy.png"
    if (weatherData === "Thunderstorm") return "/images/008-storm.png"
    if (weatherData === "Drizzle") return "/images/031-snowflake.png"
    if (weatherData === "Atomsphere") return "/images/033-hurricane.png"
}
// TopWeather()
MornEve()
renderWeather()
deleteMemo()
getMemo()
setMemo()
setTime()
setRenderBackground();

setInterval(() => {
    setRenderBackground();
}, 5000)

