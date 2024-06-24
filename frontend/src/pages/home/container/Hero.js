import { useNavigate } from "react-router-dom";
import Search from "../../../components/Search";
import { images } from "../../../constants";

const Hero = () => {
  const navigate = useNavigate();
  const handleSearch = ({ searchKeyword }) => {
    navigate(`/blog?page=1&search=${searchKeyword}`);
  };

  return (
    <section className="container mx-auto flex flex-col px-10 py-5 lg:flex-row items-center">
      <div className="mt-10 lg:w-1/2">
        <h1 className="font-roboto text-3xl text-center font-bold text-dark-soft md:text-5xl lg:text-left lg:max-w-[540px]">
          Read the most interesting articles
        </h1>
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-left">
          Explore the latest articles created just for you. From insightful
          analyses to captivating stories, we have it all. Dive into a world of
          knowledge, inspiration, and discovery.
        </p>

        <Search onSearchKeyword={handleSearch} />

        <div className="flex mt-4 flex-col lg:flex-row lg:items-start lg:flex-nowrap lg:gap-x-4 lg:mt-7">
          <span className="text-dark-light font-semibold italic mt-2 lg:mt-4">
            Popular Tags:
          </span>
          <ul className="flex flex-wrap gap-x-2.5 gap-y-2.5 mt-3">
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              Design
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              User Experience
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              User Interface
            </li>
          </ul>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <img
          className="w-full"
          src={images.HeroImage}
          alt="Users are reading articles"
        />
      </div>
    </section>
  );
};
export default Hero;
