# app/services/country_state_city_service.rb
class CountryStateCityService
  include HTTParty
  base_uri 'https://api.countrystatecity.in/v1'

  # Lấy API key từ biến môi trường. Nếu chưa được thiết lập sẽ raise exception
  API_KEY = ENV.fetch('COUNTRY_STATE_CITY_API_KEY') do
    raise "COUNTRY_STATE_CITY_API_KEY environment variable is missing"
  end

  def get_countries
    response = self.class.get('/countries', headers: headers)
    response.success? ? response.parsed_response : raise("Error fetching countries: #{response.message}")
  end

  def get_states(country_code)
    response = self.class.get("/countries/#{country_code}/states", headers: headers)
    response.success? ? response.parsed_response : raise("Error fetching states for #{country_code}: #{response.message}")
  end

  def get_cities(country_code, state_code)
    response = self.class.get("/countries/#{country_code}/states/#{state_code}/cities", headers: headers)
    response.success? ? response.parsed_response : raise("Error fetching cities for #{state_code}: #{response.message}")
  end

  def get_city_by_id(country_code, state_code, city_id)
    cities = get_cities(country_code, state_code)
    city = cities.find { |c| c['id'].to_s == city_id.to_s }
    city.present? ? city : raise("City not found with ID: #{city_id}")
  end

  def get_city_name(country_code, state_code, city_id)
    get_city_by_id(country_code, state_code, city_id)['name']
  rescue => e
    raise "Error finding city name: #{e.message}"
  end

  private

  def headers
    { "X-CSCAPI-KEY" => API_KEY }
  end
end
