"use client";
import React, { useState } from "react";
import Blog from "../../common/Blog";
import { useIntersectionObserver } from "../language-context";
import { useGetPosts } from "@/hook/post";
import CustomPagination from "@/components/pagination/CustomPagination";

const BlogsGrid = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  const [page, setPage] = useState(1);
  const { posts, meta, isLoading } = useGetPosts(page);

  return (
    <section ref={elementRef} className="py-16 md:py-20 lg:py-24">
      <div className="container ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-7">
          {posts?.map((blog, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-out delay-${
                index * 200
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Blog
                key={blog._id}
                image={blog.image}
                title={blog.title}
                description={blog.description}  
                link={`/blogs/${blog._id}`}
                isVisible={true}
                delay={`${index * 100}`}
              />
            </div>
          ))}
        </div>
        <CustomPagination
          page={page}
          totalPages={meta?.totalPages}
          onPageChange={(p) => setPage(p)}
          showPagination={!isLoading || meta?.totalPages > 1}
        />
      </div>
    </section>
  );
};

export default BlogsGrid;
