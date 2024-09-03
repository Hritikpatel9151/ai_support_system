import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

function AdminServiceForm() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const services = await adminService.fetchServices();
            setServices(services);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await adminService.updateService(editId, formData);
            setIsEditing(false);
        } else {
            await adminService.createService(formData);
        }
        setFormData({ name: '', description: '' });
        const updatedServices = await adminService.fetchServices();
        setServices(updatedServices);
    };

    const handleEdit = (service) => {
        setFormData({ name: service.name, description: service.description });
        setIsEditing(true);
        setEditId(service.id);
    };

    const handleDelete = async (id) => {
        await adminService.deleteService(id);
        const updatedServices = await adminService.fetchServices();
        setServices(updatedServices);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Service Management</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="name"
      type="text"
      value={formData.name}
      onChange={handleChange}
      placeholder="Service Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Service Description"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
      rows="4"
    ></textarea>
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      {isEditing ? 'Update' : 'Add'} Service
    </button>
  </form>
  <ul className="mt-6 space-y-2">
    {services.map((service) => (
      <li
        key={service.id}
        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200"
      >
        <span className="text-gray-800">{service.name}</span>
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(service)}
            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(service.id)}
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

export default AdminServiceForm;
