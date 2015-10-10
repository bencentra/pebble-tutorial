var xhrRequest = function(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

// Success callback for receiving location
function locationSuccess(pos) {
  var lat, lon, url;
  // Construct URL
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
  url = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon;
  url += '&APPID=ece87b5e9ca34587fa0b35ec23421a55';
  // Request weather data
  xhrRequest(url, 'GET', function(response) {
    var json, temperature, conditions;
    // Format data
    json = JSON.parse(response);
    temperature = Math.round(json.main.temp - 273.15); // Convert from Kelvin
    console.log('Temperature is ' + temperature);
    conditions = json.weather[0].main;
    console.log('Conditions are ' + conditions);
    // Create dictionary of Message Keys
    var dict = {
      'KEY_TEMPERATURE': temperature,
      'KEY_CONDITIONS': conditions
    };
    // Send to Pebble
    Pebble.sendAppMessage(
      dict,
      function(e) {
        console.log('Weather info sent to Pebble successfully!');
      },
      function(e) {
        console.log('Error sending weather info to Pebble!');
      }
    );
  });
}

// Error callback for location
function locationError(err) {
  console.log('Error requesting location!');
}

// Get weather data
function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess, 
    locationError, 
    { timeout: 15000, maximumAge: 60000 }
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS ready!');
  
  // Get the initial weather
  getWeather();
});

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage', function(e) {
  console.log('AppMessage received!');
  getWeather();
});
