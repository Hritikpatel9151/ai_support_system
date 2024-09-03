import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

function AdminCustomerForm() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '',phone:'', address:'' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const customers = await adminService.fetchCustomers();
            setCustomers(customers);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await adminService.updateCustomer(editId, formData);
            setIsEditing(false);
        } else {
            await adminService.createCustomer(formData);
        }
        setFormData({ name: '', email: '',phone:'', address:''  });
        const updatedCustomers = await adminService.fetchCustomers();
        setCustomers(updatedCustomers);
    };

    const handleEdit = (customer) => {
        setFormData({ name: customer.name, email: customer.email,phone: customer.phone,address: customer.address });
        setIsEditing(true);
        setEditId(customer.id);
    };

    const handleDelete = async (id) => {
        await adminService.deleteCustomer(id);
        const updatedCustomers = await adminService.fetchCustomers();
        setCustomers(updatedCustomers);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Management</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="name"
      value={formData.name}
      type="text"
      onChange={handleChange}
      placeholder="Customer Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <input
      name="email"
      value={formData.email}
      type="email"
      onChange={handleChange}
      placeholder="Email"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <input
      name="phone"
      value={formData.phone}
      type="text"
      onChange={handleChange}
      placeholder="Phone"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <input
      name="address"
      value={formData.address}
      type="text"
      onChange={handleChange}
      placeholder="Address"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      {isEditing ? 'Update' : 'Add'} Customer
    </button>
  </form>
  <ul className="mt-6 space-y-2">
    {customers.map((customer) => (
      <li
        key={customer.id}
        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200"
      >
        <span className="text-gray-800">{customer.name} - {customer.email} - {customer.phone} - {customer.address}</span>
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(customer)}
            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(customer.id)}
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

export default AdminCustomerForm;
