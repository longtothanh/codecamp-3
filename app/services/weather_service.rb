# app/services/weather_service.rb
require 'httparty'

class WeatherService
  include HTTParty
  base_uri 'http://api.weatherapi.com/v1'

  API_KEY = ENV.fetch('WEATHER_API_KEY') { raise "WEATHER_API_KEY environment variable is missing" }

  def initialize(city)
    @city = city
  end

  def get_current_weather
    response = self.class.get('/current.json', query: current_weather_params)
    response.success? ? response['current'] : nil
  end

  def get_forecast
    response = self.class.get('/forecast.json', query: forecast_params)

    if response.success?
      forecast_days = response.dig('forecast', 'forecastday')
      puts "Number of forecast days: #{forecast_days.length}" if forecast_days
      {
        'location' => response['location'],
        'forecast' => { 'forecastday' => forecast_days }
      }
    else
      puts "API Error: #{response.body}"
      nil
    end
  end

  private

  def current_weather_params
    { key: api_key, q: @city }
  end

  def forecast_params
    { key: api_key, q: @city, days: 7, aqi: 'no' }
  end

  def api_key
    API_KEY
  end
end
