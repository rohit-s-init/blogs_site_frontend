import API from "./API.js";

export const loginUser = (data) => {
  return API.post("/api/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/api/auth/register", data);
};

export const getCurrentUser = () => {
  return API.get("/api/auth/me");
};
