
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfigurationForm = () => {
    const [config, setConfig] = useState({ email_retrieval_frequency: 0, sla_response_time: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
        try {
        const response = await axios.get('http://localhost:8000/configurations/');
        setConfig(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            await axios.put('http://localhost:8000/configurations/', config);
            alert("Configuration updated successfully!");
          } catch (error) {
            if (error.response && error.response.data) {
              alert(error.response.data.message);
            } else {
              alert("An error occurred while updating the configuration.");
            }
          }
    };
    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
  <div>
    <label className="block text-gray-700 font-medium mb-2">
      Email Retrieval Frequency (minutes):
    </label>
    <input
      type="number"
      value={config.email_retrieval_frequency}
      onChange={(e) =>
        setConfig({ ...config, email_retrieval_frequency: e.target.value })
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <div>
    <label className="block text-gray-700 font-medium mb-2">
      SLA Response Time (hours):
    </label>
    <input
      type="number"
      value={config.sla_response_time}
      onChange={(e) =>
        setConfig({ ...config, sla_response_time: e.target.value })
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <button
    type="submit"
    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
  >
    Save
  </button>
</form>
    );
};

export default ConfigurationForm;
