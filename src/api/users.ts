import axios from "axios"
import { API_ENDPOINT } from "../constants/endpoint.constants";

export const fetchUserList = (count: number = 100) => {
    return axios.get(`${API_ENDPOINT}?results=${count}`);
}