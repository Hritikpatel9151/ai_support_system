import React from 'react'
import AdminCustomerForm from "../components/AdminCustomerForm";
import AdminServiceForm from "../components/AdminServiceForm";
import AdminSLAForm from "../components/AdminSLAForm";
import ConfigurationForm from '../components/ComfigurationForm';
import AuditLog from '../components/AuditLog';
import EmailTemplateManager from '../components/EmailTemplateManager';
import Logout from '../components/Logout';

const Adminpage = () => {
  return (
 
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 space-y-8">
     <Logout/>
  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Management</h2>
    <AdminCustomerForm />
  </section>

  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Management</h2>
    <AdminServiceForm />
  </section>

  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">SLA Management</h2>
    <AdminSLAForm />
  </section>

  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Email Template Management</h2>
    <EmailTemplateManager />
  </section>

  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Configuration</h2>
    <ConfigurationForm />
  </section>

  <section className="bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Audit Logs</h2>
    <AuditLog />
  </section>
</div>

  )
}

export default Adminpage
