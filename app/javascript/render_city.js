$(function () {
  $(document).on("change", "#state", function(e) {
    e.preventDefault();

    const selectedState = $(this).val();
    const selectedCountry = $("#country").val();

    if (selectedState && selectedCountry) {
      $.ajax({
        url: `/countries/${selectedCountry}/states/${selectedState}/cities`,
        method: "GET",
        dataType: "json",
        success: function(data) {
          // console.log("Cities data:", data);

          if (data) {
            $(".form-group").append('<div id="city-wrapper"></div>');
          }

          let citySelect = `
            <select class="form-select my-3 me-3 bg-dark" id="city" name="city">
              <option value="">Select City</option>
              ${data.map(city => `<option value="${city.id}">${city.name}</option>`).join('')}
            </select>
          `;

          $("#city-wrapper").html(citySelect);
        },
        error: function(error) {
          console.error("Error fetching cities:", error);
          if ($("#city-wrapper").length > 0) {
            $("#city-wrapper").html('<select class="form-select my-3 me-3 bg-dark" disabled><option>Error loading cities</option></select>');
          }
        }
      });
    } else {
      $("#city-wrapper").empty();
    }
  });

  $(document).on("change", "#city", function() {
    const selectedCity = $(this).val();
    const selectedState = $("#state").val();
    const selectedCountry = $("#country").val();

    if (selectedCity && selectedState && selectedCountry) {
      $.ajax({
        url: `/cities/show`,
        method: "GET",
        data: {
          country_code: selectedCountry,
          state_code: selectedState,
          city_id: selectedCity
        },
        success: function(cityData) {
          // console.log("City data:", cityData);
          displayCityName(cityData.name);

          $.ajax({
            url: '/weather',
            method: "GET",
            data: { city: cityData.name },
            success: function(weatherData) {
              // console.log("Weather data:", weatherData);
              displayWeather(weatherData);
            },
            error: function(error) {
              console.error("Error fetching weather:", error);
              showError("Unable to fetch weather data");
            }
          });

          $.ajax({
            url: '/weather/forecast',
            method: "GET",
            data: { city: cityData.name, days: 7 },
            success: function(forecastData) {
              console.log("Forecast data:", forecastData);
              updateForecastDisplay(forecastData);
            },
            error: function(error) {
              console.error("Error fetching forecast:", error);
              showError("Unable to fetch forecast data");
            }
          });
        },
        error: function(error) {
          console.error("Error fetching city:", error);
          showError("Unable to fetch city data");
        }
      });
    }
  });
});

function displayCityName(cityName) {
  const cityDisplayHtml = `
    <div class="city-info mt-4">
      <h4>Selected City: ${cityName}</h4>
    </div>
  `;

  $("#city-display").html(cityDisplayHtml);
}

function displayWeather(data) {
  console.log(data)
  const weatherHtml = `
    <div class="weather-info mt-4">
      <div class="current-weather">
        <div class="temperature">
          <h2>${data.temp_c}°C</h2>
          <p>Feels like ${data.feelslike_c}°C</p>
        </div>
        <div class="conditions">
          <img src="${data.condition.icon}" alt="${data.condition.text}">
          <p>${data.condition.text}</p>
        </div>
        <div class="details">
          <p>Humidity: ${data.humidity}%</p>
          <p>Wind: ${data.wind_kph} km/h</p>
        </div>
      </div>
    </div>
  `;

  $("#weather-display").html(weatherHtml);
}

function updateForecastDisplay(data) {
  const today = new Date();

  const forecastHtml = data.forecast.forecastday.map(day => {
    const date = new Date(day.date);
    const isToday = date.toDateString() === today.toDateString();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    return `
      <div class="forecast-card ${isToday ? 'current-day' : ''}">
        <div class="forecast-header">
          <h4>${dayName}</h4>
          <p>${date.toLocaleDateString()}</p>
        </div>
        <div class="forecast-body">
          <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
          <div class="temperature">
            <p class="high">${day.day.maxtemp_c}°C</p>
            <p class="low">${day.day.mintemp_c}°C</p>
          </div>
          <p class="condition">${day.day.condition.text}</p>
          <div class="details">
            <p><strong>Humidity:</strong><i>${day.day.avghumidity}%</i></p>
            <p><strong>Max wind:</strong><i>${day.day.maxwind_kph} km/h</i></p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  $(".forecast").html(forecastHtml);
}

function showError(message) {
  const errorHtml = `
    <div class="alert alert-danger mt-4">
      ${message}
    </div>
  `;

  $("#city-display, #weather-display").html(errorHtml);
}
