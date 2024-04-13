import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";

interface weather {
  description: string;
  main: string;
  icon: string;
}

interface main {
  temp: number | any;
  humidity: number;
  pressure: number;
}

interface wind {
  deg: number;
  gust: number;
  speed: number;
}

interface weatherData {
  id: number;
  name: string;
  timezone: number;
  main: main;
  weather: weather[];
  wind: wind;
}

interface forecast {
  list: {
    dt: number;
    dt_txt: string;
    main: main;
    weather: weather[];
  }[];
}

const Temp: React.FC = () => {
  const navigate = useNavigate();
  const API_KEY: string = "5cb8d6323dc2288570c7608201d44f80";
  const { id } = useParams<string>();
  const paramsData: any = id?.split("+");
  const [weatherData, setWeatherData] = useState<weatherData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<forecast>();

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${paramsData[1]}&lon=${paramsData[2]}&appid=${API_KEY}`
      )
      .then((res) => setWeatherData(res.data))
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, [API_KEY]);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${paramsData[1]}&lon=${paramsData[2]}&cnt=5&appid=${API_KEY}`
      )
      .then((res) => {
        setForecast(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, [API_KEY]);

  const generateAM_PM = (date: string): string => {
    const hours = new Date(date).getHours();
    return hours >= 12 ? "PM" : "AM";
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-tr from-zinc-950 to-zinc-800 w-full flex justify-center items-start md:items-center">
      {isLoading ? (
        <div className="absolute transition-all flex justify-center items-center h-full w-full bg-zinc-800 z-20">
          <svg
            className="h-32 w-32"
            version="1.1"
            id="L9"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enable-background="new 0 0 0 0"
            xmlBase="preserve"
          >
            <path
              fill="#fff"
              d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1s"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      ) : null}
      <div className="border-[1px] m-4 transition-all flex flex-col gap-3 text-white border-zinc-600/40 p-3 rounded-lg bg-zinc-800/50 backdrop-blur-md shadow-xl shadow-zinc-950/40 hover:shadow-lg">
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-5">
              <span className="py-2 px-5 border-zinc-700 rounded-md border-[1px] self-start">
                {weatherData?.name}
              </span>

              <div className="px-3 flex flex-col gap-4">
                <p>{weatherData?.weather[0]?.description}</p>
                <span className="flex text-6xl gap-1">
                  {(weatherData?.main?.temp - 273.15).toFixed(1)}{" "}
                  <b className="font-normal text-sm">°C</b>{" "}
                </span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/@${paramsData[1]},${paramsData[2]},14z?entry=ttu`}
              className="size-10 flex justify-center items-center border-zinc-700 rounded-md border-[1px] self-start"
              target="blank"
            >
              <FaMapMarkedAlt />
            </a>
            <div className="flex gap-2 flex-col">
              <legend className="font-semibold text-white/70">
                Humidity :{" "}
                <span className=" font-normal text-[#ff5b49]">
                  {weatherData?.main?.humidity} %
                </span>
              </legend>
              <legend className="font-semibold text-white/70">
                Wind :{" "}
                <span className=" font-normal text-[#ff5b49]">
                  {weatherData?.wind?.speed} km/h
                </span>
              </legend>
              <legend className="font-semibold text-white/70">
                Atmospheric :{" "}
                <span className=" font-normal text-[#ff5b49]">
                  {weatherData?.main?.pressure} Pa
                </span>
              </legend>
            </div>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@4x.png`}
            alt=""
          />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {forecast?.list?.map((i) => (
            <div
              key={i.dt}
              className="py-2 relative flex-auto w-[10pc] h-[15pc] hover:rotate-1 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 px-5 border-zinc-700 rounded-md border-[1px] self-start"
            >
              <span className="text-white/90">
                {i.dt_txt.slice(10, 16)} {generateAM_PM(i.dt_txt)}
              </span>
              <h1 className="text-xl flex gap-1">
                {(i.main.temp - 273.15).toFixed(1)}
                <b className="font-normal text-sm">°C</b>{" "}
              </h1>
              <img
                src={`https://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`}
                alt=""
              />
              <span className="text-center font-semibold text-sm text-white/60">
                {i.weather[0].description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Temp;
