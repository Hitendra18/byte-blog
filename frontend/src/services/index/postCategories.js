import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const getAllCategories = async (
  searchKeyWord = "",
  page = 1,
  limit = 10
) => {
  try {
    const { data, headers } = await axiosInstance.get(
      `/api/post-categories?searchKeyWord=${searchKeyWord}&page=${page}&limit=${limit}`
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.message) {
      throw new Error(error.response.message);
    }
    throw new Error(error.message);
  }
};

export const deleteCategory = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.delete(`/api/post-categories/${slug}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.message) {
      throw new Error(error.response.message);
    }
    throw new Error(error.message);
  }
};
export const createCategory = async ({ title, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.post(
      `/api/post-categories`,
      { title },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.message) {
      throw new Error(error.response.message);
    }
    throw new Error(error.message);
  }
};

export const updateCategory = async ({ title, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.put(
      `/api/post-categories/${slug}`,
      { title },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.message) {
      throw new Error(error.response.message);
    }
    throw new Error(error.message);
  }
};

export const getSingleCategory = async ({
  slug,
  successFlag = false,
  setCategoryTitle,
}) => {
  try {
    const { data } = await axiosInstance.get(`/api/post-categories/${slug}`);

    if (successFlag) {
      setCategoryTitle(data?.title);
    }

    return data;
  } catch (error) {
    if (error.response && error.response.message) {
      throw new Error(error.response.message);
    }
    throw new Error(error.message);
  }
};
