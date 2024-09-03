import axios from 'axios';

const API_URL = 'http://localhost:8000/users/audit-logs/';

const createAuditLog = async (log) => {
  const response = await axios.post(API_URL,log);
  return response.data;
};
const getAuditLogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


export { getAuditLogs, createAuditLog };
