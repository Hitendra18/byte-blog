import { Link } from "react-router-dom";

const BreadCrumb = ({ data }) => {
  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap">
      {data.map((item, index) => (
        <div
          key={item + index}
          className="text-black font-roboto opacity-50 text-xs md:text-sm"
        >
          <Link to={item.link}>{item.name}</Link>
          {index !== data.length - 1 && <span className="px-3">/</span>}
        </div>
      ))}
    </div>
  );
};
export default BreadCrumb;
