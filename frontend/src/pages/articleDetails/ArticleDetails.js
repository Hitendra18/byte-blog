import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import SocialShareButtons from "../../components/SocialShareButtons";
import ErrorMessage from "../../components/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import { useEffect, useState } from "react";

import ArticleDetailsSkeleton from "./components/ArticleDetailsSkeleton";
import { useSelector } from "react-redux";
import Editor from "../../components/editor/Editor";

const ArticleDetails = () => {
  const userState = useSelector((state) => state.user);
  const { slug } = useParams();
  const [breadCrumbData, setBreadCrumbData] = useState([]);
  // const [body, setBody] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      getSinglePost({
        slug,
        setBreadCrumbData,
        successFlag: true,
      }),
    queryKey: ["blog", slug],
  });

  const { data: postsData } = useQuery({
    queryFn: () => {
      return getAllPosts();
    },
    queryKey: ["posts"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailsSkeleton />
      ) : isError ? (
        <ErrorMessage message={"Couldn't fetch this post"} className={"mb-8"} />
      ) : (
        <section className="container max-w-5xl mx-auto flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumb data={breadCrumbData} />
            <img
              className="rounded-xl w-full mt-4"
              src={
                data?.photo
                  ? process.env.REACT_APP_UPLOAD_FOLDER_BASE_URL + data.photo
                  : images.SampleImage
              }
              alt={data?.title}
            />
            <div className="mt-4 flex gap-2">
              {data &&
                data?.categories &&
                data.categories.map((category) => (
                  <div
                    key={category._id}
                    className="text-primary text-sm font-roboto block md:text-base"
                  >
                    {category.title}
                  </div>
                ))}
            </div>

            <h1 className="text-[22px] font-roboto font-medium mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            <div className="w-full">
              {!isLoading && !isError && (
                <Editor content={data?.body} editable={false} />
              )}
            </div>
            <CommentsContainer
              comments={data?.comments}
              className="mt-10"
              loggedInUserId={userState?.userInfo?._id}
              postSlug={slug}
            />
          </article>
          <div>
            <SuggestedPosts
              header="Latest Articles"
              posts={postsData?.data}
              tags={data?.tags}
              className="mt-8 lg:mt-0 lg:max-w-xs"
            />
            <div className="mt-7">
              <h2 className="font-roboto font-medium text-dark-hard mb-4 md:text-xl">
                Share On:
              </h2>
              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};
export default ArticleDetails;
