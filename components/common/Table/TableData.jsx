import Link from "next/link";
import React from "react";
import ProfileAvatar from "../ImageViewer/ProfileAvatar";

const TableData = ({ path, image, id, name }) => {
  return (
    <Link href={`${path}`}>
      <span
        className="group flex items-center gap-2 text-accent cursor-pointer relative
    px-2 py-1 rounded-md transition-all duration-200 ease-out
    hover:bg-accent/8
    hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.15),0_2px_8px_hsl(var(--accent)/0.12)]
    active:scale-[0.98] active:bg-accent/12
    after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0
    after:bg-accent/60 after:rounded after:transition-all after:duration-200
    hover:after:w-full"
      >
        {/* Avatar — only if image is provided */}
        {image && (
          <span className="transition-all duration-200 group-hover:ring-2 group-hover:ring-accent/30 group-hover:ring-offset-1 rounded-full">
            <ProfileAvatar src={image} size={20} />
          </span>
        )}

        {/* ID — always shown */}
        {id && <div>{id}</div>}

        {/* Name — only if name is provided */}
        {name && <div>{name}</div>}
      </span>
    </Link>
  );
};

export default TableData;
