import axios, { AxiosResponse } from "axios";

export default async function handler(request, response) {
  const { lat, lon } = request.query;
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OWM_API_KEY}`;
  try {
    let res = await axios.get(url);
    let { name, country } = res.data[0];
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "s-maxage=3600,stale-while-revalidate");
    response.status(200).send({ location: `${name}, ${country}` });
  } catch (e) {
    console.log(e);
    response.status(500).send(e);
  }
}
