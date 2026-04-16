import { RightArrowIcon } from "@/public/assets/icons/icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Blog = ({
  image,
  title,
  description,
  link,
  isVisible = true,
  delay = "0",
}) => {
  return (
    <div
      className={`bg-white rounded-[10px] overflow-hidden flex flex-col border border-[#CAD5E2] transition-all duration-1000 ease-out delay-${delay} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } hover:shadow-lg hover:shadow-gray-200/50 group`}
    >
      <Link
        href={link}
        className="block w-full aspect-[1.94/1] overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="!relative object-cover w-full h-full transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </Link>
      <div className="pt-2.5 p-6 flex flex-col flex-1">
        <h3 className="text-xl font-medium mb-4 leading-tight">
          <Link
            href={link}
            className="text-black hover:text-primary-1 transition inline-block"
          >
            {title}
          </Link>
        </h3>
        <div
          className="text-[#585858] mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <a
          href={link}
          className="text-primary-1 font-medium flex items-center gap-2 mt-auto group/readmore"
        >
          Read More
          <span className="translate-x-0 group-hover/readmore:translate-x-2 transition-transform duration-300">
            {RightArrowIcon}
          </span>
        </a>
      </div>
    </div>
  );
};

export default Blog;
