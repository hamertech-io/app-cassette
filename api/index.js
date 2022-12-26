import { BASE_API_URL } from "../constants";

export const fetchCassette = async () => {
  return fetch(`https://cassette-json.s3.us-west-1.amazonaws.com/data.json`, {
    method: "GET",
  });
};
