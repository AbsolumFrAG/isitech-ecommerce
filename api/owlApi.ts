import axios from "axios";

const owlApi = axios.create({
    baseURL: '/api'
});

export default owlApi;