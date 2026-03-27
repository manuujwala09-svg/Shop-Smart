import axios from "axios";
const BASE_URL = "http://localhost:5000/api/address";

export const getUserAddress = async (userId) => {
  const res = await axios.get(`${BASE_URL}/get/${userId}`);
  return res.data;
};

export const updateUserAddress = async (userId, address) => {
  const res = await axios.put(`${BASE_URL}/update/${userId}`, { address });
  return res.data;
};
