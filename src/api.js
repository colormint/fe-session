import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/posts';

export const getPosts = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(API_BASE_URL, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
