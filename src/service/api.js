import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use((config) => {
  config.baseURL = "https://mustafocoder.pythonanywhere.com";
  return config;
});

export const loginAPI = async (body) => {
  const res = await axios.post("/auth/login/", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
export const signupAPI = async (body) => {
  const res = await axios.post("/auth/signup/", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getUserAPI = async (token) => {
  const res = await axios.get("/auth/user/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

export const createArticleAPI = async (body, token) => {
  const res = await axios.post("/api/articles/create/", body, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteArticleAPI = async(id, token) => {
  const res = await axios.delete(`/api/articles/${id}/delete/`, {
    credentials: 'include',
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json"
    }
  })
  return res.data
}

export const updateArticleAPI = async (id, body, token) => {
  const res = await axios.put(`/api/articles/${id}/update/`, body, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};