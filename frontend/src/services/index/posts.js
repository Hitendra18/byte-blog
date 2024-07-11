import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const getAllPosts = async (searchKeyWord = "", page = 1, limit = 10) => {
  try {
    const {data, headers} = await axiosInstance.get(
      `/api/posts?searchKeyWord=${searchKeyWord}&page=${page}&limit=${limit}`
    );

    return { data, headers };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async ({
  slug,
  setBreadCrumbData,
  successFlag = false,
  setInitialPhoto = undefined,
  setCategories = undefined,
  setTitle = undefined,
  setTags = undefined,
  setCaption = undefined,
}) => {
  try {
    const { data } = await axiosInstance.get(`/api/posts/${slug}`);

    if (successFlag) {
      setBreadCrumbData &&
        setBreadCrumbData([
          { name: "Home", link: "/" },
          { name: "Blog", link: "/blog" },
          { name: "Article Title", link: `/blog/${data.slug}` },
        ]);
      setInitialPhoto && setInitialPhoto(data?.photo);
      setCategories && setCategories(data.categories.map((item) => item.title));
      setTitle && setTitle(data?.title);
      setTags && setTags(data?.tags);
      setCaption && setCaption(data?.caption);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const deletePost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.delete(`/api/posts/${slug}`, config);
    return data;
  } catch (error) {
    toast.error(error.response.statusText);
    throw new Error(error.message);
  }
};

export const updatePost = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axiosInstance.put(`/api/posts/${slug}`, updatedData, config);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPost = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.post(`/api/posts`, {}, config);
    return data;
  } catch (error) {
    toast.error(error.response.statusText);
    throw new Error(error.message);
  }
};
