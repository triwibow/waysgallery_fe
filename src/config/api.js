import axios from 'axios';

const API = axios.create({
    baseURL: "https://wide-eyed-singlet-dove.cyclic.app/api/v1"
});

const setAuthToken = (token) => {
    if(token){
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
}

export {
    API,
    setAuthToken
}