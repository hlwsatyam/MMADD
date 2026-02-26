import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/affiliates`;

const api = axios.create({
  baseURL: API_URL,
});

export const affiliateApi = {
  // Get all affiliates with pagination
  getAffiliates: (params) => api.get('/', { params }),

  // Create affiliate
  createAffiliate: (formData) => {
    return api.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Get single affiliate
  getAffiliate: (id) => api.get(`/${id}`),

  // Update affiliate
  updateAffiliate: (id, formData) => {
    return api.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Delete affiliate
  deleteAffiliate: (id) => api.delete(`/${id}`),

  // Bulk delete affiliates
  bulkDeleteAffiliates: (ids) => api.post('/bulk-delete', { ids }),

  // Track click
  trackClick: (id) => api.post(`/${id}/track`),

  // Update status
  updateStatus: (id, status) => api.patch(`/${id}/status`, { status })
};