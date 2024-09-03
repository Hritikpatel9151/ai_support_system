import React, { useState, useEffect } from 'react';
import { getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } from '../services/emailTemplateService';

const EmailTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getEmailTemplates();
      setTemplates(data);
    };

    fetchTemplates();
  }, []);

  const handleCreate = async () => {
    const newTemplate = { name, subject, body };
    await createEmailTemplate(newTemplate);
    const data = await getEmailTemplates();
    setTemplates(data);
    setName('');
    setSubject('');
    setBody('');
  };

  const handleUpdate = async () => {
    const templateUpdate = { name, subject, body };
    await updateEmailTemplate(selectedTemplate.id, templateUpdate);
    const data = await getEmailTemplates();
    setTemplates(data);
    setSelectedTemplate(null);
    setName('');
    setSubject('');
    setBody('');
  };

  const handleDelete = async (templateId) => {
    await deleteEmailTemplate(templateId);
    const data = await getEmailTemplates();
    setTemplates(data);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setName(template.name);
    setSubject(template.subject);
    setBody(template.body);
  };

  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Email Template Manager</h1>

      <div className="mb-8">
        <ul className="space-y-2">
          {templates.map((template) => (
            <li
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            >
              {template.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {selectedTemplate ? 'Update Template' : 'Create Template'}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={selectedTemplate ? handleUpdate : handleCreate}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {selectedTemplate ? 'Update' : 'Create'}
          </button>
          {selectedTemplate && (
            <button
              onClick={() => handleDelete(selectedTemplate.id)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateManager;
