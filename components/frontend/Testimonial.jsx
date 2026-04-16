import Image from "next/image";

const Testimonial = ({ description, name, image }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-[30] flex flex-col justify-between h-full ">
      <p className="text-base sm:text-lg md:text-xl font-medium mb-5 text-black">
        “{description}”
      </p>
      <div className="flex items-center mt-auto">
        <figure className="w-10 md:w-[50px] h-10 md:h-[50px] rounded-full mr-[14px] overflow-hidden">
          <Image
            fill
            src={image}
            alt={name}
            className="!relative object-cover h-full w-full"
          />
        </figure>
        <span className="font-medium text-sm sm:text-base text-black">
          {name}
        </span>
      </div>
    </div>
  );
};

export default Testimonial;
