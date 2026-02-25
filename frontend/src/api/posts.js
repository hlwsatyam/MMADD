import axiosInstance from './axios';

export const getPosts = (params = {}) => {
  return axiosInstance.get('/posts', { params });
};

export const getPostById = (id) => {
  return axiosInstance.get(`/posts/${id}`);
};

export const createPost = (data) => {
  return axiosInstance.post('/posts', data);
};

export const getMyPosts = () => {
  return axiosInstance.get('/posts/my-posts');
};

export const deletePost = (id) => {
  return axiosInstance.delete(`/posts/${id}`);
};

export const updatePost = (id, data) => {
  return axiosInstance.put(`/posts/${id}`, data);
};





// New function: Get posts by category
export const getPostsByCategory = (category, params = {}) => {
  return axiosInstance.get(`/posts/category/${category}`, { params });
};

// You can also add this for featured posts
export const getFeaturedPosts = (limit = 4) => {
  return axiosInstance.get('/posts/featured', { params: { limit } });
};