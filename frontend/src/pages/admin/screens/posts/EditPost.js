import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { HiOutlineCamera } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Editor from "../../../../components/editor/Editor";
import ErrorMessage from "../../../../components/ErrorMessage";
import { getSinglePost, updatePost } from "../../../../services/index/posts";
import { getAllCategories } from "../../../../services/index/postCategories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import ArticleDetailsSkeleton from "../../../articleDetails/components/ArticleDetailsSkeleton";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();

  return filterCategories(inputValue, categoriesData);
};

const EditPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState(null);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [postSlug, setPostSlug] = useState(slug);
  const [caption, setCaption] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      getSinglePost({
        slug,
        successFlag: true,
        setInitialPhoto,
        setCategories,
        setTitle,
        setTags,
        setCaption,
      }),
    queryKey: ["blog", slug],
  });

  const {
    mutate: mutateUpdatePostDetails,
    isLoading: isLoadingUpdatePostDetails,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({ updatedData, slug, token });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Post is updated successfully");
      navigate(`/admin/posts/manage/edit/${data?.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handelFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size && file.size > 1 * 1024 * 1024) {
      toast.error("Max file size should be 1MB");
      return;
    }
    setPhoto(file);
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();

    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        process.env.REACT_APP_UPLOAD_FOLDER_BASE_URL + data?.photo
      );
      updatedData.append("postPicture", picture);
    }

    updatedData.append(
      "document",
      JSON.stringify({ body, categories, title, tags, slug: postSlug, caption })
    );

    mutateUpdatePostDetails({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  const handleDeleteImage = () => {
    if (window.confirm("Do you want to delete this post picture")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  let isPostDataLoaded = !isLoading && !isError;

  return (
    <div>
      {isLoading ? (
        <ArticleDetailsSkeleton />
      ) : isError ? (
        <ErrorMessage message={"Couldn't fetch this post"} className={"mb-8"} />
      ) : (
        <section className="container max-w-5xl mx-auto flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={process.env.REACT_APP_UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onChange={handelFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
            >
              Delete Image
            </button>
            <div className="mt-4 flex gap-2">
              {data &&
                data.categories &&
                data?.categories.map((category) => (
                  <Link
                    key={category._id}
                    className="text-primary text-sm font-roboto block tracking-[2px] md:text-base"
                    to={`/blog?category=${category.name}`}
                  >
                    {category.name}
                  </Link>
                ))}
            </div>

            <div className="d-form-control w-full">
              <label htmlFor="title" className="text-lg">
                Title
              </label>
              <input
                id="title"
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-2 w-full border-2 mt-2 border-slate-300 outline-slate-500 text-[22px] font-roboto font-medium text-dark-hard rounded-md"
                placeholder="Enter title here..."
              />
            </div>

            <div className="d-form-control w- mt-5">
              <label htmlFor="caption" className="text-lg">
                Caption
              </label>
              <input
                id="caption"
                value={caption}
                type="text"
                onChange={(e) => setCaption(e.target.value)}
                className="px-4 py-2 w-full border-2 mt-2 border-slate-300 outline-slate-500 text-[22px] font-roboto font-medium text-dark-hard rounded-md"
                placeholder="Enter caption here..."
              />
            </div>

            <div className="d-form-control w-full mt-5">
              <label htmlFor="slug" className="text-lg">
                Slug
              </label>
              <input
                id="slug"
                value={postSlug}
                type="text"
                onChange={(e) =>
                  setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                className="px-4 py-2 w-full border-2 mt-2 border-slate-300 outline-slate-500 text-[22px] font-roboto font-medium text-dark-hard rounded-md"
                placeholder="Enter slug here..."
              />
            </div>

            <div className="my-5 space-y-2">
              <label className="text-lg">Categories</label>
              {isPostDataLoaded && (
                <MultiSelectTagDropdown
                  defaultValue={data.categories.map(categoryToOption)}
                  loadOptions={promiseOptions}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>

            <div className="my-5 space-y-2">
              <label className="text-lg">Tags</label>
              {isPostDataLoaded && (
                <CreatableSelect
                  className="relative z-20"
                  defaultValue={data.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
                  isMulti={true}
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>

            <div className="w-full">
              {isPostDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetails}
              type="button"
              onClick={handleUpdatePost}
              className="w-full bg-green-500 rounded-lg px-4 text-white font-semibold py-2 mt-10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Post
            </button>
          </article>
        </section>
      )}
    </div>
  );
};
export default EditPost;
