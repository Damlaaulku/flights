import axios from "axios";

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = process.env.RAPIDAPI_HOST;

export const getFlights = async (params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  adults: string;
  cabinClass?: "economy";
  sortBy?: "best";
  currency?: "USD";
  market?: "en-US";
  countryCode?: "US";
}) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights",
    params,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const getAirports = async (params: {
  query: string;
  locale?: "en-US";
}) => {
  const options = {
    method: "GET",
    url: "https://sky-scanner3.p.rapidapi.com/api/v1/flights/searchAirport",
    params,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
  };
  const response = await axios.request(options);
  return response.data;
};
