import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ads';

export const adApi = {
  // Get all ads (admin)
  getAllAds: (params) => axios.get(API_URL, { params }),

  // Get active ads (public)
  getPublicAds: () => axios.get(`${API_URL}/public`),

  // Create ad
  createAd: (formData) => axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Get single ad
  getAd: (id) => axios.get(`${API_URL}/${id}`),

  // Update ad
  updateAd: (id, formData) => axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Delete ad
  deleteAd: (id) => axios.delete(`${API_URL}/${id}`),

  // Bulk delete
  bulkDelete: (ids) => axios.post(`${API_URL}/bulk-delete`, { ids }),

  // Track click
  trackClick: (id) => axios.post(`${API_URL}/${id}/track`),

  // Update order
  updateOrder: (orders) => axios.post(`${API_URL}/update-order`, { orders })
};