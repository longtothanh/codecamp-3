class HomeController < ApplicationController
  before_action :initialize_country_service

  def index
    begin
      @countries = @country_service.get_countries
    rescue => e
      @error_message = e.message
    end
  end

  def states
    begin
      states = @country_service.get_states(params[:country_code])
      render json: states
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def cities
    begin
      cities = @country_service.get_cities(params[:country_code], params[:state_code])
      render json: cities
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def show_city
    begin
      city = @country_service.get_city_by_id(params[:country_code], params[:state_code], params[:city_id])
      render json: { name: city['name'] }
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def weather
    begin
      weather_service = WeatherService.new(params[:city])
      weather_data = weather_service.get_current_weather
      render json: weather_data
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def forecast
    begin
      weather_service = WeatherService.new(params[:city])
      forecast_data = weather_service.get_forecast
      render json: forecast_data
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def initialize_country_service
    @country_service = CountryStateCityService.new
  end
end
