import { Link } from "react-router-dom";
import { images } from "../../../constants";

const SuggestedPosts = ({ className, header, posts, tags = [] }) => {
  return (
    <div
      className={`w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg p-4 ${className}`}
    >
      <h2 className="font-roboto font-medium text-dark-hard md:text-xl">
        {header}
      </h2>
      <div className="grid gap-y-5 mt-5 md:grid-cols-2 md:gap-x-5 lg:grid-cols-1">
        {posts &&
          posts.map((item) => (
            <div
              key={item?._id}
              className="flex space-x-3 flex-nowrap items-center"
            >
              <img
                className="aspect-square object-cover rounded-lg w-1/5"
                src={
                  item?.photo
                    ? process.env.REACT_APP_UPLOAD_FOLDER_BASE_URL + item?.photo
                    : images.SampleImage
                }
                alt="post"
              />
              <div className="text-sm font-roboto text-dark-hard font-medium">
                <h3 className="md:text-base lg:text-lg">
                  <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                </h3>
                <span className="font-light text-xs opacity-60">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
      </div>
      <h2 className="font-roboto font-medium text-dark-hard mt-8 md:text-xl">
        Tags
      </h2>
      {tags?.length === 0 ? (
        <p className="text-slate-500 text-xs md:text-sm mt-2">
          There is no tags for this post
        </p>
      ) : (
        <div className="flex flex-wrap mt-4 gap-y-2 gap-x-2">
          {tags.map((item) => (
            <Link
              key={item}
              to="/"
              className="inline-block rounded-md px-3 py-1.5 bg-primary font-roboto text-xs space-x-2 text-white md:text-sm"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default SuggestedPosts;
