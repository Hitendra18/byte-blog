import { images } from "../../../constants";

const CTA = () => {
  return (
    <>
      <svg
        className="w-full h-auto max-h-40 translate-y-[1px]"
        preserveAspectRatio="none"
        viewBox="0 0 2160 263"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Wave"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2160 262.5H0V0C360 80 720 120 1080 120C1440 120 1800 80 2160 0V262.5Z"
          fill="#0D2436"
        />
      </svg>
      <section className="relative bg-dark-hard px-5">
        <div className="container grid grid-cols-12 mx-auto py-10 md:pb-20 lg:place-items-center">
          <div className="col-span-12 grid grid-cols-12 lg:place-items-center">
            <div className="col-span-12 mb-20 hidden md:block lg:col-span-6 lg:order-last lg:px-5">
              <div className="w-1/2 lg:w-3/4 mx-auto relative ">
                <div className="h-1/2 w-1/2 rounded-lg bg-[#FFFFFF] opacity-[6%] absolute -bottom-[8%] -left-[15%]" />
                <div className="h-1/2 w-1/2 rounded-lg bg-[#FC5A5A] absolute top-[10%] -right-[8%]" />
                <div className=" w-full p-3 rounded-xl bg-white z-[1] relative">
                  <img
                    src={images.CtaImage}
                    alt="title"
                    className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
                  />
                  <div className="p-5">
                    <h2 className="font-roboto font-bold text-xl md:text-2xl lg:text-[28px]">
                      The best articles every week
                    </h2>
                    <p className="text-dark-light mt-3 text-sm md:text-lg">
                      Our insurance plans offers are priced the same everywhere
                      else.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:order-first lg:px-5">
              <h2 className="text-white font-roboto font-bold text-2xl md:text-4xl md:text-center md:leading-normal lg:text-left">
                Get our stories delivered From us to your inbox weekly.
              </h2>
              <div className="w-full max-w-[494px] mt-10 gap-y-3 mx-auto flex flex-col md:flex-row md:gap-x-2 lg:mx-0">
                <input
                  type="text"
                  placeholder="Your Email"
                  className="focus:outline-none px-4 py-3 w-full rounded-lg placeholder:text-dark-light "
                />
                <button className="bg-primary px-4 py-3 w-full rounded-lg text-white font-bold md:w-fit md:text-nowrap">
                  Get Started
                </button>
              </div>
              <p className="text-dark-light text-sm leading-7 mt-3 md:text-center md:w-3/4 md:mx-auto md:mt-6 lg:text-left lg:mx-0">
                <span className="font-bold italic text-[#B3BAC5]">
                  Get a response tomorrow
                </span>{" "}
                if you submit by 9pm today. If we received after 9pm will get a
                response the following day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CTA;
