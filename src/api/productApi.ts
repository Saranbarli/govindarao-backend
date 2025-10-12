import axios from "axios";

const API_URL = "/api/products";

export const fetchProducts = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createProduct = async (product: {
  name: string;
  price: number;
  category: string;
  stock: number;
}) => {
  const { data } = await axios.post(API_URL, product);
  return data;
};

export const updateProduct = async (id: string, product: any) => {
  const { data } = await axios.put(`${API_URL}/${id}`, product);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
