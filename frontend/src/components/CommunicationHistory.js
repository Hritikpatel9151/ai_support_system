import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunicationHistory = ({ ticketId }) => {
    const [communications, setCommunications] = useState([]);

    useEffect(() => {
      if (ticketId) {
        const fetchCommunications = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/communication_history/${ticketId}`);
            setCommunications(response.data);
          } catch (error) {
            console.error("Error fetching communication history:", error);
          }
        };

        fetchCommunications();
      }
    }, [ticketId]);

    return (
       
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Communication History</h3>
        <ul className="space-y-4">
          {Array.isArray(communications) && communications.length > 0 ? (
            communications.map((comm) => (
              <li key={comm.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-700"><strong>Ticket ID:</strong> {comm.ticketId}</p>
                <p className="text-gray-700"><strong>Content:</strong> {comm.content}</p>
                <p className="text-gray-500 text-sm"><strong>Timestamp:</strong> {new Date(comm.timestamp).toLocaleString()}</p>
                <hr className="my-2" />
              </li>
            ))
          ) : (
            <li className="text-gray-500">No communications found</li>
          )}
        </ul>
      </div>
    );
};

export default CommunicationHistory;
