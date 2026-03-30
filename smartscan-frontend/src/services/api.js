import axios from "axios";

const API_URL = "http://localhost:8000";

export const processImage = (formData) => {
  return axios.post(`${API_URL}/process`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
