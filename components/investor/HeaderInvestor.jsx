"use client";

import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const languages = [
  { lang: "English", value: "ENG", flag: "/assets/icons/uk-flag.png" },
  { lang: "Arabic", value: "AR", flag: "/assets/icons/saudi-flag.png" },
];

const HeaderInvestor = () => {
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [showLangs, setShowLangs] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLangs(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white fixed top-0 w-full z-20">
      <nav className="container min-h-20 !py-4 flex justify-between items-center gap-2">
        <Link href="/" className="inline-block">
          <Image
            src="/assets/images/logo.webp"
            alt="greenwealth"
            width={193}
            height={32}
            className="w-[193px] aspect-auto object-contain"
          />
        </Link>

        <div className="flex items-center">
          {/* Already have account */}
          <p className="text-[#344054] text-lg font-medium me-3 hidden md:inline-block">
            {pathname.includes("signup")
              ? `Already `
              : pathname.includes("login") && `Don't `}
            Have An Account?
          </p>
          {/* Login Btn */}
          <Link href={pathname.includes("signup") ? "login" : "signup"}>
            <Button
              variant="outline"
              className="!text-lg !font-medium me-2 sm:me-4 md:me-7"
            >
              {pathname.includes("signup")
                ? "Login"
                : pathname.includes("login") && "Create Account"}
            </Button>
          </Link>

          <div
            className={pathname.includes("login") ? "hidden" : "relative"}
            ref={dropdownRef}
          >
            {/* Language Btn */}
            {/* <Button
              onClick={() => setShowLangs(!showLangs)}
              variant="outline"
              className="!text-lg !font-medium !py-1.5 lg:!py-2.5 flex items-center gap-2"
            >
              <Image
                src={currentLang.flag}
                alt={currentLang.value}
                width={24}
                height={24}
                className="size-6 aspect-square object-cover rounded-full hidden sm:block"
              />
              <span>{currentLang.value}</span>
              <IoIosArrowDown className="text-xl" />
            </Button> */}

            {/* Languages */}
            {showLangs && (
              <ul className="bg-white py-[11px] space shadow-md rounded-lg absolute top-12 right-0 w-max min-w-full">
                {languages.map((lang) => (
                  <li
                    key={lang.value}
                    onClick={() => {
                      setCurrentLang(lang);
                      setShowLangs(false);
                    }}
                    className="px-[15px] py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Image
                      src={lang.flag}
                      alt={lang.value}
                      width={24}
                      height={24}
                      className="size-6 aspect-square object-cover rounded-full"
                    />
                    <span>{lang.lang}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderInvestor;
