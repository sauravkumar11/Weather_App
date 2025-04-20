import React from 'react';
import './Weather.css';
import Searchcity from '../assets/message/search-city.png'
import NotFound from '../assets/message/not-found.png';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forcast, setForcast] = useState(null);

    const [notFound, setNotFound] = useState(false);
    const apiKey = '005cd9b7e0d68ede9200572b79cf6970';
    const apiKeyforcast = 'feb8b7b3dc734a1c997154606251904';


    const handleOnChange = (e) => {
        const inputValue = e.target.value.trim();
        if (inputValue === '') {
            setWeather(null); // Clear weather data if input is empty
            setNotFound(false); // Reset notFound state
        }
        setCity(inputValue);
        console.log(inputValue);
    };

    useEffect(() => {
        if (city) {
            console.log(city); // Logs the updated city value
        }
    }, [city]);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!city) return; // Avoid fetching weather for an empty city

            const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyforcast}&q=${city}&days=14`;
            try {
                const [openWeatherResponse, weatherApiResponse] = await Promise.all([
                    axios.get(openWeatherUrl),
                    axios.get(weatherApiUrl),
                ]);
                setWeather(openWeatherResponse.data)
                setForcast(weatherApiResponse.data)
                setNotFound(false);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setWeather(null);
                setNotFound(true);// Clear weather data on error
            }
        };

        fetchWeather();
    }, [city]);

    return (
        <>
            <div className='main-container'>
                <header className='input-container'>
                    <input
                        className='city-input'
                        type="text"
                        placeholder='Search City'
                        value={city}
                        onChange={handleOnChange}
                        spellCheck='false'
                    />
                    <button className='search-btn'>
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </button>
                </header>

                {/* Weather Info Section */}
                <section className='weather-info' style={{ display: weather ? 'block' : 'none' }}>
                    <div className='location-date-conatiner'>
                        <div className='location'>
                            <span className="material-symbols-outlined">
                                location_on
                            </span>
                            <h4 className='country-txt'>{weather?.city?.name || '...'}</h4>
                        </div>
                        <h5 className='current-date-text regular-txt'>{new Date().toDateString()}</h5>
                    </div>
                    <div className='weather-summary-container'>
                        <img
                            src={`http://openweathermap.org/img/wn/${weather?.list?.[0]?.weather?.[0]?.icon}.png`}
                            alt="weather icon"
                            className='weather-summary-img'
                        />
                        <div className='weather-summary-info'>
                            <h2 className='temp-txt'>{weather?.list?.[0]?.main?.temp || '...'} °C</h2>
                            <h3 className='condition-txt regular-txt'>{weather?.list?.[0]?.weather?.[0]?.description || 'N/A'}</h3>
                        </div>
                    </div>
                    <div className='weather-conditions-container'>
                        <div className='condition-item'>
                            <span className="material-symbols-outlined">water_drop</span>
                            <div className='condition-info'>
                                <h5 className='humidity-value-txt'>{weather?.list?.[0]?.main?.humidity || '...'} %</h5>
                                <div className='regular-txt'>Humidity</div>
                            </div>
                        </div>
                        <div className='condition-item'>
                            <span className="material-symbols-outlined"><span class="material-symbols-outlined">
                                wind_power
                            </span></span>
                            <div className='condition-info'>
                                <div className='wind-value-txt'>{weather?.list?.[0]?.wind?.speed || '...'} m/s</div>
                                <div className='regular-txt'>Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    <div className='forecast-items-container'>
                        {weather?.list?.map((item, index) => (
                            <div key={index} className='forecast-item'>
                                <h5 className='forecast-item-date regular-txt'>
                                    {new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                <img
                                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                    alt="weather icon"
                                    className='forecast-item-img'
                                />
                                <h5 className='forecast-item-condition regular-txt'>{item.weather[0].description}</h5>
                                <h5 className='forecast-item-temp'>{item.main.temp} °C</h5>
                            </div>
                        ))}
                    </div>
                    <div className='forecast-items-container-for-thirty-days'>
                        {forcast?.forecast?.forecastday?.map((item, index) => {
                            const dayOfWeek = index === 0 
                                ? "Today" 
                                : new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }); // Get day name

                            // Reverse the date format to DD-MM-YY
                            // const reversedDate = item.date.split('-').slice(2).concat(item.date.split('-').slice(1, 2)).join('-'); 

                            return (
                                <div key={index} className='forecast-item-for-thirty-days'>
                                    <h5 className='forecast-item-day-for-thirty-days regular-txt'>
                                        {dayOfWeek} {/* Displaying "Today", "Sunday", etc. */}
                                    {/* <h6 className='forecast-item-date-for-thirty-days small-txt'>
                                        {reversedDate}
                                    </h6> */}
                                    </h5>
                                    
                                    <img
                                        src={`https:${item.day.condition.icon}`} // Corrected icon URL
                                        alt="weather icon"
                                        className='forecast-item-img-for-thirty-days'
                                    />
                                    <h5 className='forecast-item-condition-for-thirty-days regular-txt'>
                                        {item.day.condition.text} 
                                    </h5>
                                    <h5 className='forecast-item-temp'>
                                        {item.day.avgtemp_c} °C 
                                    </h5>
                                </div>
                            );
                        })}
                    </div>
                </section>
                <section className='search-city section-message'
                    style={{ display: !weather && !notFound ? 'block' : 'none' }}
                >
                    <img src={Searchcity} alt="search icon" />
                    <div>
                        <h1>Search City</h1>
                        <h4 className='find-out-weather regular-txt'>Find out the Weather Conditions of the city</h4>
                    </div>
                </section>
                <section className='not-found section-message' style={{ display: notFound ? 'block' : 'none' }}>
                    <img src={NotFound} alt="not found icon" />
                    <div>
                        <h1>City Not Found</h1>
                        <h4 className='regular-txt'>Please try searching for another city</h4>
                    </div>
                </section>

            </div>
        </>
    )
}

export default Weather
