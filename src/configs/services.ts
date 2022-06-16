import axios from "axios"

export const LocationAPI = axios.create({
  baseURL: process.env.LOCATION_API_URL,
})
