import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const signup = async ({ name, email, password }) => {
  try {
    const { data } = await axiosInstance.post("/api/users/register", {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const { data } = await axiosInstance.post("/api/users/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const getUserProfile = async ({ token, adminCheck, successFn }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.get("/api/users/profile", config);

    if (adminCheck && !data.admin) {
      successFn();
    }

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const updateProfile = async ({ token, userData, userId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.put(
      `/api/users/updateProfile/${userId}`,
      userData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const updateProfilePicture = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.put(
      "/api/users/updateProfilePicture",
      formData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const getAllUsers = async (
  token,
  searchKeyWord = "",
  page = 1,
  limit = 10
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, headers } = await axiosInstance.get(
      `/api/users?searchKeyWord=${searchKeyWord}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const deleteUser = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.delete(`/api/users/${slug}`, config);
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};
