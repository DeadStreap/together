const API_BASE_URL = "together-alpha-one.vercel.app";
const API_PROTOCOL = "https";

const getApiUrl = (endpoint) => {
    return `${API_PROTOCOL}://${API_BASE_URL}${endpoint}`;
};

export { API_BASE_URL, API_PROTOCOL, getApiUrl };