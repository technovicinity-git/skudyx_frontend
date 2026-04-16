"use client";
import Image from "next/image";
// import { BookmarkIcon, LikeIcon, ShareIcon } from "@/public/assets/icons/icons";
import Loader from "@/components/loader/Loader";
import { useGetPost } from "@/hook/post";
import { formatDate } from "@/utils/formatDate";
import { Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

const BlogDetailsSection = () => {
  // Mock data for demonstration

  const [open, setOpen] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const { id } = useParams();

  const { post, isLoading } = useGetPost(id);

  const shareOptions = [
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "X",
      icon: <FaTwitter className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-5 h-5" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
  ];

  const handleShare = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share cancelled:", err);
      }
    } else {
      setOpen((prev) => !prev);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader fullWidth={true} />
      </div>
    );
  }

  return (
    <section className="bg-white ">
      <div className="pt-28 md:pt-[125px] pb-6 md:pb-10 lg:pb-12">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight max-w-[800px] mx-auto">
            {post?.title}
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-[820px] mx-auto">
            {post?.subtitle}
          </p> */}
          <div className="flex flex-wrap items-center justify-center row-y-2 gap-x-8 md:gap-16 mb-8 text-start">
            {/* <div className="space-y-3">
              <span className="text-sm text-[#667085] block">Written by</span>
              <div className="flex items-center gap-2">
                <figure className="h-8 w-8">
                  <Image
                    fill
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="h-full w-full rounded-full object-cover !relative"
                  />
                </figure>
                <p className="font-semibold text-gray-900 text-base md:text-lg ">
                  {blog.author.name}
                </p>
              </div>
            </div> */}
            <div className="flex gap-2">
              <span className=" text-[#667085] block">Published on: </span>
              <p className="font-semibold text-gray-900 text-base md:text-lg ">
                {formatDate(post?.createdAt)}
              </p>
            </div>
            {/* Icons for bookmark, like, share can be added here if needed */}
            <div className="flex items-center gap-3 mt-6 sm:mt-0">
              {/* <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Bookmark"
              >
                {BookmarkIcon}
              </button>

              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Like"
              >
                {LikeIcon}
              </button> */}

              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  aria-label="Share"
                >
                  <Share2 className="w-6 h-6" />
                </button>

                {open && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                    {shareOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => handleShare(option.url)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full text-left rounded cursor-pointer"
                      >
                        {option.icon}
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full aspect-[2.5/1] rounded-xl overflow-hidden mb-6">
            <Image
              src={post?.image}
              alt={post?.title}
              fill
              className="object-cover w-full h-full !relative"
              priority
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="editor-content pt-5 md:pt-8 lg:pt-10 pb-20 md:pb-24 lg:pb-36">
          <div
            className="text-[#585858] mb-4"
            dangerouslySetInnerHTML={{ __html: post?.description }}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsSection;
