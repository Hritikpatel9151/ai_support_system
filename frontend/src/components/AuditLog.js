import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditLogService';


const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getAuditLogs();
      setLogs(data);
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Audit Logs</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="py-2 px-4 text-left text-gray-600">ID</th>
          <th className="py-2 px-4 text-left text-gray-600">Action</th>
          <th className="py-2 px-4 text-left text-gray-600">Performed By</th>
          <th className="py-2 px-4 text-left text-gray-600">Timestamp</th>
          <th className="py-2 px-4 text-left text-gray-600">Details</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">{log.id}</td>
            <td className="py-2 px-4">{log.action}</td>
            <td className="py-2 px-4">{log.performed_by}</td>
            <td className="py-2 px-4">{log.timestamp}</td>
            <td className="py-2 px-4">{log.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AuditLog;
