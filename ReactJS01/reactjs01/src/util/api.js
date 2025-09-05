import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
  const URL_API = "/api/v1/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/api/v1/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/api/v1/user";
  return axios.get(URL_API);
};

export { createUserApi, loginApi, getUserApi };

//Product
const getAllProducts = (page = 1, limit = 10, category = "") => {
  let URL_API = `/api/v1/products?page=${page}&limit=${limit}`;

  if (category) {
    URL_API += `&category=${encodeURIComponent(category)}`;
  }

  return axios.get(URL_API);
};

export { getAllProducts };
