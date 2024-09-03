import axios from 'axios';

const API_URL = 'http://localhost:8000/tickets';

const getTickets = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createTicket = async (ticket) => {
  const response = await axios.post(API_URL, ticket);
  return response.data;
};

const updateTicket = async (ticketId, ticketUpdate) => {
  const response = await axios.put(`${API_URL}/${ticketId}`, ticketUpdate);
  return response.data;
};

export { getTickets, createTicket, updateTicket };
