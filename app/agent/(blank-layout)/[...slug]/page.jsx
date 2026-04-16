"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const CatchAllPage = () => {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Get the slug from params
    const slug = params.slug;

    // Convert slug to title (capitalize and replace hyphens with spaces)
    const pageTitle = slug
      ? slug
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "Page";

    // Redirect to not-found page with title
    router.replace(`/admin/not-found?title=${encodeURIComponent(pageTitle)}`);
  }, [params.slug, router]);

  // Show loading while redirecting
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-[#EAECF0] p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#067647] mb-4"></div>
          <p className="text-lg font-medium text-[#101828]">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default CatchAllPage;
