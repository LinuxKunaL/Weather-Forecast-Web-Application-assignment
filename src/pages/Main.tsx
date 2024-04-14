import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { ImSearch } from "react-icons/im";
import { IoMdOpen } from "react-icons/io";
import { Link } from "react-router-dom";
import { Toast } from "../components/toast";
import { GoListOrdered } from "react-icons/go";

interface coordinates {
  lon: number;
  lat: number;
}

interface cities {
  geoname_id: number;
  name: string;
  ascii_name: string;
  cou_name_en: string;
  population: number;
  coordinates: coordinates;
  timezone: string;
}

const Main: React.FC = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchForRecommendBox, setSearchForRecommendBox] = useState<any>("");
  const [onChangeInput, setOnChangeInput] = useState<string | any>("");
  const [limit, setLimit] = useState(10);
  const [searchRecommendBox, setSearchRecommendBox] = useState<string[]>([]);
  const [listOfCities, setListOfCities] = useState<cities[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${
          limit === 100 ? 100 : limit
        }&refine=cou_name_en%3A%22India%22`
      )
      .then((res) => {
        const { results } = res.data;
        setListOfCities(results);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        Toast("API limit reach", "error");
      });
  }, [limit]);

  useEffect(() => {
    axios
      .get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${
          limit === 100 ? 100 : limit
        }&refine=cou_name_en%3A%22India%22`
      )
      .then((res) => {
        const { results } = res.data;

        const filterResult: cities[] = results.filter((res: cities) =>
          res.ascii_name
            .toLowerCase()
            .includes(searchForRecommendBox.toLowerCase())
        );

        const recommendNameArray = filterResult.map((city) => city.ascii_name);

        setSearchRecommendBox(recommendNameArray);
      })
      .catch((err) => {
        console.log(err);
        Toast("Invalid API limit", "error");
      });
  }, [searchForRecommendBox, limit]);

  const searchItem = () => {
    if (!onChangeInput) return Toast("search city name !", "error");

    const filterResult: cities[] = listOfCities.filter((res: cities) =>
      res.ascii_name.toLowerCase().includes(onChangeInput.toLowerCase())
    );
    setListOfCities(filterResult);
  };

  const handleShowRecommendBox: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setSearchForRecommendBox(event.target.value);
    setOnChangeInput(event.target.value);
    searchRef.current?.classList.add("showSearchRecommend");
  };

  document.addEventListener("click", () =>
    searchRef.current?.classList.remove("showSearchRecommend")
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLTableSectionElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      if (scrollHeight - scrollTop === clientHeight) {
        setLimit((pre) => pre + 10);
      }
    },
    []
  );

  const orderByName = () => {
    setListOfCities(listOfCities.reverse());
  };

  return (
    <div className="h-full p-3 text-xl bg-transparent bg-gradient-to-tr from-zinc-950 to-zinc-800 w-full flex justify-center items-center">
      <Toaster />
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
            enableBackground="new 0 0 0 0"
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
      <div className="border-[1px] flex flex-col gap-3 text-white border-zinc-600/40 p-3 rounded-lg bg-zinc-800/50 backdrop-blur-md shadow-xl shadow-zinc-950/40 hover:shadow-lg transition-all w-full lg:w-max">
        <div className="flex text-xl items-center gap-2">
          <div className="px-2 h-12 py-1 w-48 text-lg text-white/80 bg-zinc-900/40 rounded-full flex justify-between items-center border-[1px] border-zinc-800/90 relative">
            <input
              type="text"
              placeholder="search"
              className="bg-transparent w-28 ml-1 outline-none border-none"
              onChange={handleShowRecommendBox}
              value={onChangeInput}
            />
            <div
              onClick={searchItem}
              className="size-8 bg-zinc-800/50 border-zinc-700/50 cursor-pointer p-1.5 rounded-full active:scale-105 transition-all flex justify-center items-center border-[1px]"
            >
              <ImSearch />
            </div>
            <div
              style={{ visibility: "hidden" }}
              className="flex h-[10pc] overflow-y-auto opacity-0 visible w-full list-none flex-col absolute top-12 left-0 p-2 rounded-lg border-[1px] border-zinc-800/90 divide-y-[1px] divide-zinc-800/70 bg-zinc-900/90 backdrop-blur-md z-10"
              ref={searchRef}
              onMouseLeave={() =>
                searchRef.current?.classList.remove("showSearchRecommend")
              }
            >
              {searchRecommendBox.map((i) => (
                <li
                  key={i}
                  className="p-1 active:scale-95 transition-all cursor-pointer"
                  onClick={(e) => {
                    setOnChangeInput(e.currentTarget.innerText);
                  }}
                >
                  {i}
                </li>
              ))}
            </div>
          </div>
          <div
            onClick={orderByName}
            className="size-11 text-xl bg-zinc-900/40 text-white/80 cursor-pointer p-1.5 rounded-md border-[1px] border-zinc-800/90 active:scale-105 transition-all flex justify-center items-center"
          >
            <GoListOrdered />
          </div>
        </div>
        <div
          onScroll={handleScroll}
          className="bg-zinc-900/50 relative border-[1px] border-zinc-800/90 backdrop-blur-md overflow-auto rounded-lg h-[25pc] lg:h-[18pc]"
        >
          <table>
            <thead className="shadow-lg bg-zinc-800/50 backdrop-blur-lg uppercase sticky top-0 shadow-zinc-900/60">
              <tr>
                <th className="p-3">geoName id</th>
                <th className="p-3">city name</th>
                <th className="p-3">country</th>
                <th className="p-3">population</th>
                <th className="p-3">coordinates</th>
                <th className="p-3">timezone</th>
              </tr>
            </thead>
            <tbody className="text-white/70 divide-y">
              {listOfCities.map((cities) => (
                <tr
                  key={cities.geoname_id}
                  className="border-b-[1px] border-zinc-800/90"
                >
                  <td className="p-2">{cities.geoname_id}</td>
                  <td className="p-3">
                    <Link
                      className="hover:text-indigo-500 transition-all"
                      to={`/temp/${cities.ascii_name}+${cities.coordinates.lat}+${cities.coordinates.lon}`}
                    >
                      {cities.ascii_name}
                    </Link>
                  </td>
                  <td className="p-3">{cities.cou_name_en}</td>
                  <td className="p-3">{cities.population}</td>
                  <td className="p-3">
                    <a
                      className="flex gap-1 items-center underline opacity-85 hover:text-indigo-400 transition-all"
                      target="blank"
                      href={`https://www.google.com/maps/@${cities.coordinates.lat},${cities.coordinates.lon},14z?entry=ttu`}
                    >
                      {cities.coordinates.lat},{cities.coordinates.lon}
                      <IoMdOpen />
                    </a>
                  </td>
                  <td className="p-3">{cities.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Main;
