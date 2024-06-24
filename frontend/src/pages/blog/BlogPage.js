import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/index/posts";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ArticleCard from "../../components/ArticleCard";
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";

let isFirstRun = true;

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue.page) || 1;
  const searchKeyword = searchParamsValue.search || "";

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12),
    queryKey: ["posts"],
  });

  useEffect(() => {
    window.scroll(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, refetch, searchKeyword]);

  const handlePageChange = (page) => {
    //change the page query string to URL
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  return (
    <MainLayout>
      <section className="flex flex-col container mx-auto px-10 py-10">
        <Search
          className={"mb-10 -mt-4 w-full lg:max-w-xl mx-auto"}
          onSearchKeyword={handleSearch}
        />
        <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
          {isLoading || isFetching ? (
            [...Array(3)].map((_, index) => (
              <ArticleCardSkeleton
                key={index}
                className={
                  "w-full md:w-[calc(50%-10px)] lg:w-[calc(33.7%-20px)]"
                }
              />
            ))
          ) : isError ? (
            <ErrorMessage message={"Error loading articles"} />
          ) : data?.data.length === 0 ? (
            <p className="mx-auto text-xl text-orange-500 font-bold">
              No Posts Found!
            </p>
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
        {!isLoading && (
          <Pagination
            onPageChange={(page) => handlePageChange(page)}
            currentPage={currentPage}
            totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
          />
        )}
      </section>
    </MainLayout>
  );
};
export default BlogPage;
