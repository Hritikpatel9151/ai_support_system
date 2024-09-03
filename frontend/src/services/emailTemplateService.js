import axios from 'axios';

const API_URL = 'http://localhost:8000/email_templates';

const getEmailTemplates = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createEmailTemplate = async (template) => {
  const response = await axios.post(API_URL, template);
  return response.data;
};

const updateEmailTemplate = async (templateId, templateUpdate) => {
  const response = await axios.put(`${API_URL}/${templateId}`, templateUpdate);
  return response.data;
};

const deleteEmailTemplate = async (templateId) => {
  const response = await axios.delete(`${API_URL}/${templateId}`);
  return response.data;
};

export { getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate };
