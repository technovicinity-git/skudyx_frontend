import { LeafIcon } from "@/public/assets/icons/icons";
import React from "react";

const Subtitle = ({ text }) => (
  <span className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[#EBEBEB] bg-white text-black text-sm md:text-base font-medium mb-3 ">
    <span>{LeafIcon}</span>
    {text}
  </span>
);

export default Subtitle;
