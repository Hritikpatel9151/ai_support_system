import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

function AdminSLAForm() {
    const [slas, setSLAs] = useState([]);
    const [formData, setFormData] = useState({ level: '', response_time: '',resolution_time:'' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const slas = await adminService.fetchSLAs();
            setSLAs(slas);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await adminService.updateSLA(editId, formData);
            setIsEditing(false);
        } else {
            await adminService.createSLA(formData);
        }
        setFormData({ level: '', response_time: '',resolution_time:'' });
        const updatedSLAs = await adminService.fetchSLAs();
        setSLAs(updatedSLAs);
    };

    const handleEdit = (sla) => {
        setFormData({ level: sla.level, response_time: sla.response_time, resolution_time: sla.resolution_time });
        setIsEditing(true);
        setEditId(sla.id);
    };

    const handleDelete = async (id) => {
        await adminService.deleteSLA(id);
        const updatedSLAs = await adminService.fetchSLAs();
        setSLAs(updatedSLAs);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">SLA Management</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="level"
      type="text"
      value={formData.level}
      onChange={handleChange}
      placeholder="Level"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <input
      name="response_time"
      type="text"
      value={formData.response_time}
      onChange={handleChange}
      placeholder="Response Time"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <input
      name="resolution_time"
      type="text"
      value={formData.resolution_time}
      onChange={handleChange}
      placeholder="Resolution Time"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      {isEditing ? 'Update' : 'Add'} SLA
    </button>
  </form>
  <ul className="mt-6 space-y-2">
    {slas.map((sla) => (
      <li
        key={sla.id}
        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200"
      >
        <span className="text-gray-800">{sla.level}</span>
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(sla)}
            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(sla.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

    );
}

export default AdminSLAForm;
