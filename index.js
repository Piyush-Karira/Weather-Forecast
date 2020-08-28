/*Global Variables*/
const api_key = 'API_KEY';
const container = document.querySelector('.container');
const locationInfo = document.querySelector('.location-info');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthMap = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04':'Apr', '05': 'May', '06': 'June', '07':'July',
  '08': 'Aug', '09':'Sept', '10': 'Oct', '11':'Nov', '12': 'Dec'
}
var info = new Map();

/* method called on submit click for getting weather data*/
function getWeatherData(){
  var location = document.querySelector('input').value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = response => {
    var data = response.target;
    if (data.readyState == 4 && data.status == 200) { 
      const weatherData = JSON.parse(data.responseText);
      setElements(weatherData);
    }
  };
  if(location!='' && location != undefined){
    let api_url = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${location}&days=3`;
    console.log(api_url);
    xhttp.open("GET", api_url);
    xhttp.send();
    xhttp.onerror = function () {
    console.log("** An error occurred during the transaction");
};
  }
  else{
   container.innerHTML = '';
   locationInfo.innerHTML = '<h3> Enter City Name</h3>'
  }
}

/*method called by getWeatherData() for setting DOM structure*/
var setElements = (weatherData) => {
  container.innerHTML = '';
  locationInfo.innerHTML = '<h3> Enter City Name</h3>'

  var currentData = weatherData.current;
  var forecastData = weatherData.forecast.forecastday;
  console.log(forecastData);
  
  const upperContainer = document.createElement('div');
  const lowerContainer = document.createElement('div');
  const left = document.createElement('div');
  const leftInfo = document.createElement('div');
  const right = document.createElement('div');
  const weatherIcon = document.createElement('img');
 
 /****Append****/
  container.append(upperContainer);
  container.append(lowerContainer);
  upperContainer.append(left);
  upperContainer.append(right);
  left.append(weatherIcon);

  left.append(leftInfo);
  leftInfo.setAttribute('class', 'leftInfo')
  leftInfo.innerHTML = `<h2>${currentData.temp_c}<sup>o</sup> C</h2>
  <span>Today</span><p>${currentData.condition.text}</p>`


  left.addEventListener('click', setCurrentInfo);
 /*location - info*/
  locationInfo.innerHTML = `<h3>${weatherData.location.name} | ${weatherData.location.region} | ${weatherData.location.country}</h3>`
  upperContainer.setAttribute('class', 'upper-container');
  lowerContainer.setAttribute('class', 'lower-container');
  left.setAttribute('class', 'left');
  right.setAttribute('class', 'right');
  weatherIcon.src = currentData.condition.icon;

  setCurrentObject(currentData);
  setCurrentInfo();
  
  forecastData.forEach(data=>{
    const card = document.createElement('div');
    const icon = document.createElement('img');
    let d = new Date(data.date);
    let dayName = days[d.getDay()];
    icon.setAttribute('src', data.day.condition.icon);
    card.setAttribute('id', dayName);
    card.addEventListener('click', setForecastInfo);
    card.innerHTML = `<h3>${dayName}</h3><span>${getDate(data.date)}</span>`;
    card.append(icon);
    card.innerHTML += `<span>${data.day.mintemp_c}<sup>o</sup> C / ${data.day.maxtemp_c}<sup>o</sup> C</span>`;
    card.innerHTML +=`<span>MIN / MAX</span>`;
    card.setAttribute('class', 'card');
    lowerContainer.append(card);
    setForecastObject(data, dayName);
  });
}


/*methods for setting Right container for showing Info*/
function setCurrentObject(data){
  let obj = {
    'Wind': data.wind_mph,
    'Pressure': data.pressure_in,
    'Precip': data.precip_in,
    'Temp': data.temp_c
  }
  info.set('current', obj);
}

function setCurrentInfo(){
  document.querySelector('.lower-container').childNodes.forEach(el=>{
    el.classList.remove('card-focus');
  });
  const right = document.querySelector('.right');
  right.innerHTML = `<h3>Current Details</h3>
  <span>Wind: ${info.get('current').Wind} mph</span>
  <span>Pressure: ${info.get('current').Pressure} in</span>
  <span>Precipitation: ${info.get('current').Precip} in</span>
  <span>Temperature: ${info.get('current').Temp}<sup>o </sup>C</span>`
}

 function setForecastInfo(){
  document.querySelector('.lower-container').childNodes.forEach(el=>{
    el.classList.remove('card-focus');
  });
  this.setAttribute('class', 'card card-focus')
  const right = document.querySelector('.right');
  right.innerHTML = `<h3>Forecast Details</h3>
  <span>Avg Temp: ${info.get(this.id).Temp}<sup>o </sup>C</span>
  <span>Max Wind: ${info.get(this.id).Max_Wind} mph</span>
  <span>Total Precipitation: ${info.get(this.id).Total_Precip} in</span>
  <span>Avg Humidity: ${info.get(this.id).Avg_Humidity}</span>`
};


function setForecastObject(data, dayName){
  let obj = {
    'Temp': data.day.avgtemp_c,
    'Max_Wind': data.day.maxwind_mph,
    'Total_Precip': data.day.totalprecip_in,
    'Avg_Humidity': data.day.avghumidity
  }
  info.set(dayName, obj);
}


function getDate(date){
  var day = date.substr(8,2);
  var month = monthMap[date.substr(5,2)];
  return `${day} ${month}`;
}