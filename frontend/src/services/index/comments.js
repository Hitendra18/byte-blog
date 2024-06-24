import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.VITE_BACKEND_BASE_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const createNewComment = async ({
  desc,
  slug,
  parent,
  replyOnUser,
  token,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.post(
      "/api/comments",
      {
        desc,
        slug,
        parent,
        replyOnUser,
      },
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

export const updateComment = async ({ desc, commentId, token, check }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.put(
      `/api/comments/${commentId}`,
      { desc, check },
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

export const deleteComment = async ({ commentId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.delete(`/api/comments/${commentId}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const getAllComments = async (
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
      `/api/comments?searchKeyWord=${searchKeyWord}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};
