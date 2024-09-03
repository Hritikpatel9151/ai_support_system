
import React, { useState } from 'react';
import axios from 'axios';
import Logout from '../components/Logout';

const CommunicationHistory = () => {
    const [ticketid, setticketid] = useState('');
    const [communications, setCommunications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCommunications = async (ticketid) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/communication_history/${ticketid}`);
            setCommunications(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching communication history:", err);
            setError('Failed to fetch communication history. Please check the unique ID and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (ticketid) {
            fetchCommunications(ticketid);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
         <Logout/>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Track Ticket and View Communication History</h3>
            <div className="mb-4">
                <label htmlFor="uniqueId" className="block text-gray-700 font-semibold mb-2">Enter ID:</label>
                <input
                    type="text"
                    id="uniqueId"
                    value={ticketid}
                    onChange={(e) => setticketid(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                    Search
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading communication history...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
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
            )}
        </div>
    );
};

export default CommunicationHistory;
