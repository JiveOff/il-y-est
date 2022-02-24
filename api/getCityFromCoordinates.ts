import axios, { AxiosResponse } from "axios";

export default async function handler(request, response) {
  const { lat, lon } = request.query;
  // const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OWM_API_KEY}`;
  const reverseGeoUrl = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`;
  try {
    let res = await axios.get(reverseGeoUrl);
    console.log(res.data);
    let address = res.data.display_name.split(", ");
    response.setHeader("Content-Type", "application/json");
    response.setHeader(
      "Cache-Control",
      "s-maxage=36000,stale-while-revalidate"
    );
    response.status(200).send({
      location: `${res.data.address.county}, ${res.data.address.country}`,
      address: address.slice(0, 2).join(", "),
    });
  } catch (e) {
    console.log(e);
    response.status(500).send({ location: `La terre, voie lactée` });
  }
}
