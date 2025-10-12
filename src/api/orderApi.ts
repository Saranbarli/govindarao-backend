import axios from "axios";

const API_URL = "/api/orders";

export const fetchOrders = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createOrder = async (order: {
  customerId: string;
  products: { productId: string; quantity: number }[];
}) => {
  const { data } = await axios.post(API_URL, order);
  return data;
};

export const updateOrder = async (id: string, order: any) => {
  const { data } = await axios.put(`${API_URL}/${id}`, order);
  return data;
};

export const deleteOrder = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
