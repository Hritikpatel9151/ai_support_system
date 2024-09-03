import React, { useState, useEffect } from "react";
import { getTickets, updateTicket } from "../services/ticketService";
import CommunicationHistory from "./CommunicationHistory";

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  
  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getTickets();
      setTickets(data);
    };

    fetchTickets();
  }, []);
  



  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setAgentResponse(ticket.agent_response || "");
  };

  const handleUpdate = async () => {
    try {
      const ticketUpdate = { status, agent_response: agentResponse };
      await updateTicket(selectedTicket.id, ticketUpdate);
      setSelectedTicket(null);
      const updatedTickets = await getTickets();
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Ticket Dashboard</h1>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="py-2 px-4 border-b">{ticket.id}</td>
                <td className="py-2 px-4 border-b">{ticket.subject}</td>
                <td className="py-2 px-4 border-b">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Ticket</h2>
          <p className="mb-4"><strong>Subject:</strong> {selectedTicket.subject}</p>
          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Agent Response:</label>
            <textarea
              value={agentResponse}
              onChange={(e) => setAgentResponse(e.target.value)}
              placeholder="Type your response here..."
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Update
          </button>
        </div>
      )}

      {selectedTicket && (
        <div className="mt-8">
          <CommunicationHistory ticketId={selectedTicket.id} />
        </div>
      )}
    </div>
  );
};

export default TicketDashboard;
