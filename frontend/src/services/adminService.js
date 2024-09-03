import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const adminService = {
    // Customers
    fetchCustomers: async () => axios.get(`${BASE_URL}/customers/`).then(res => res.data),
    createCustomer: async (customer) => axios.post(`${BASE_URL}/customers/`, customer).then(res => res.data),
    updateCustomer: async (id, customer) => axios.put(`${BASE_URL}/customers/${id}`, customer).then(res => res.data),
    deleteCustomer: async (id) => axios.delete(`${BASE_URL}/customers/${id}`).then(res => res.data),

    // Services
    fetchServices: async () => axios.get(`${BASE_URL}/services/`).then(res => res.data),
    createService: async (service) => axios.post(`${BASE_URL}/services/`, service).then(res => res.data),
    updateService: async (id, service) => axios.put(`${BASE_URL}/services/${id}`, service).then(res => res.data),
    deleteService: async (id) => axios.delete(`${BASE_URL}/services/${id}`).then(res => res.data),

    // SLAs
    fetchSLAs: async () => axios.get(`${BASE_URL}/slas/`).then(res => res.data),
    createSLA: async (sla) => axios.post(`${BASE_URL}/slas/`, sla).then(res => res.data),
    updateSLA: async (id, sla) => axios.put(`${BASE_URL}/slas/${id}`, sla).then(res => res.data),
    deleteSLA: async (id) => axios.delete(`${BASE_URL}/slas/${id}`).then(res => res.data),
};

export default adminService;
