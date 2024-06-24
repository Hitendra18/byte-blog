import { useQuery } from "@tanstack/react-query";
import ArticleCard from "../../../components/ArticleCard";
import { FaArrowRight } from "react-icons/fa";
import { getAllPosts } from "../../../services/index/posts";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";

const Articles = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 6),
    queryKey: ["posts"],
  });

  return (
    <section className="flex flex-col container mx-auto px-10 py-10">
      <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkeleton
              key={index}
              className={"w-full md:w-[calc(50%-10px)] lg:w-[calc(33.7%-20px)]"}
            />
          ))
        ) : isError ? (
          <ErrorMessage message={"Error loading articles"} />
        ) : (
          data?.data.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.7%-20px)]"
            />
          ))
        )}
      </div>
      <Link
        to={"/blog"}
        className="mx-auto flex items-center font-bold gap-x-2 border-2 rounded-lg border-primary text-primary px-6 py-3"
      >
        <span>Show More Articles</span>
        <FaArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
};
export default Articles;
