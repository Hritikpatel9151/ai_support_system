import axios from 'axios';

const API_URL = 'http://localhost:8000/communication_history';

export const fetchCommunications = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createCommunication = async (communication) => {
    const response = await axios.post(API_URL, communication);
    return response.data;
};

