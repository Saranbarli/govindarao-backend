import axios from "axios";

const API_URL = "/api/customers";

export const fetchCustomers = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createCustomer = async (customer: {
  name: string;
  email: string;
}) => {
  const { data } = await axios.post(API_URL, customer);
  return data;
};

export const updateCustomer = async (id: string, customer: any) => {
  const { data } = await axios.put(`${API_URL}/${id}`, customer);
  return data;
};

export const deleteCustomer = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
