"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownMenuItem,
  DropdownTrigger,
} from "./Dropdown";

import { useLogout } from "@/hook/auth";
import { useGetMyProfile } from "@/hook/user";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./language-context";
import LoginChoiceModal from "./Modal/LoginChoiceModal";

export default function Header() {
  // const { lang, isArabic, toggleLanguage } = useLanguage();

  const [whiteNav, setWhiteNav] = useState(false);
  const { isArabic } = useLanguage();
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const router = useRouter();

  const { profile } = useGetMyProfile();

  const userRole = profile?.role;

  const { logout } = useLogout({
    onSuccess: () => {
      router.push(`/${userRole === "investor" ? "investor" : "admin"}/login`);
      queryClient.invalidateQueries(["myProfile"]);
    },
  });

  const navItems = [
    {
      label: isArabic ? "حول" : "About",
      href: "/about",
    },
    {
      label: isArabic ? "استثمار" : "Investment",
      href: "",
      dropdown: [
        {
          label: isArabic ? "خيارات الاستثمار" : "Crop Investment",
          href: "/available-investment?type=Crops",
        },
        {
          label: isArabic ? "استثمار الثروة الحيوانية" : "Livestock Investment",
          href: "/available-investment?type=Livestock",
        },
      ],
    },
    {
      label: isArabic ? "شركات" : "Corporate",
      href: "/corporate-investment",
    },
    {
      label: isArabic ? "للمزارعين" : "For Farmers",
      href: "/farmer/signup",
    },
    {
      label: isArabic ? "مصادر" : "Resources",
      href: "/resources",
      dropdown: [
        { label: isArabic ? "المدونة" : "Blog", href: "/blogs" },
        { label: isArabic ? "الأسئلة المتكررة" : "FAQs", href: "/faqs" },
      ],
    },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // For accordion
  const [isSticky, setIsSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    handleScroll(); // Set initial state on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper for hover class
  const navHover = isSticky ? "hover:text-primary-1" : "";

  useEffect(() => {
    if (
      pathname === "/registration" ||
      pathname.startsWith("/blogs/") ||
      pathname === "/terms-and-conditions" ||
      pathname === "/privacy-policy" ||
      pathname === "/investment-policies" ||
      pathname === "/investment-request" ||
      pathname === "/farmer/signup"
    ) {
      setWhiteNav(true);
    } else {
      setWhiteNav(false);
    }
  }, [pathname]);

  // Helper for direction
  // const dir = isArabic ? "rtl" : "ltr";
  // const langAttr = isArabic ? "ar" : "en";

  // Logo URL: white logo when not sticky, colored logo when sticky
  const logoUrl =
    isSticky || whiteNav
      ? "/assets/images/logo.webp"
      : "/assets/images/logo-white.webp";

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    logout();
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isSticky || whiteNav
          ? "bg-white shadow text-secondary"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container max-w-[1330px] ">
        <div className="flex items-center justify-between py-3 min-[991]:py-[18px]  rounded-lg flex-row rtl:flex-row-reverse">
          {/* Logo: right in RTL, left in LTR */}
          <Link
            href="/"
            className="inline-block w-[120px] xl:w-[148px] order-1 rtl:order-3"
          >
            <Image src={logoUrl} fill alt="" className="!relative" />
          </Link>

          {/* Navigation: center, orientation flips */}
          <nav className="hidden min-[991px]:flex items-center gap-4 xl:gap-8 order-2 flex-1 justify-center flex-row rtl:flex-row-reverse">
            {navItems.map((item) =>
              item.dropdown ? (
                <Dropdown key={item.label}>
                  <DropdownTrigger
                    className={navHover}
                    isSticky={isSticky || whiteNav}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  </DropdownTrigger>
                  <DropdownContent isSticky={isSticky || whiteNav}>
                    {item.dropdown.map((dropdownItem) => (
                      <DropdownMenuItem
                        key={dropdownItem.label}
                        href={dropdownItem.href}
                        isSticky={isSticky}
                      >
                        {dropdownItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-inherit font-instrument-sans text-lg font-medium ${navHover}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Buttons: left in RTL, right in LTR */}
          <div className="hidden min-[991px]:flex items-center gap-2 xl:gap-4 flex-row-reverse order-3 rtl:flex-row rtl:order-1">
            {profile ? (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/${
                        profile?.role === "investor"
                          ? "investor"
                          : "admin/investors"
                      }`
                    )
                  }
                >
                  {isArabic ? "لوحة القيادة" : "Dashboard"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                // href={`/investor/login`}
                onClick={handleLogin}
                className="w-full"
              >
                {isArabic ? "تسجيل الدخول" : "Log in"}
              </Button>
            )}
            <Button
              variant="solid"
              href="/get-started"
              className="text-inherit"
            >
              {isArabic ? "ابدأ الآن" : "Get started"}
            </Button>
            {/* Language Switcher */}
            {/* <button
              onClick={toggleLanguage}
              className="px-2 py-1 border rounded text-xs font-medium bg-gray-100 hover:bg-gray-200 ml-2 rtl:ml-0 rtl:mr-2"
              aria-label={isArabic ? "تغيير اللغة" : "Switch language"}
            >
              {isArabic ? "English" : "العربية"}
            </button> */}
          </div>

          {/* Mobile menu trigger button: always visible on mobile, orientation flips */}
          <button
            className="block min-[991px]:hidden py-1 md:py-2 cursor-pointer text-inherit opacity-80 hover:opacity-100 order-3 rtl:order-1 transition"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            style={isArabic ? { marginLeft: 0, marginRight: "auto" } : {}}
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* SideDrawer overlay and drawer (always mounted for smooth animation) */}
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
              drawerOpen
                ? "bg-black/20 opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer with slide and fade transition */}
          <div
            className={`fixed top-0 ${
              isArabic ? "left-0" : "right-0"
            } h-full pt-6 w-72 bg-white z-50 flex flex-col shadow-lg transition-all duration-300 ease-in-out transform ${
              drawerOpen
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : isArabic
                ? "-translate-x-full opacity-0 pointer-events-none"
                : "translate-x-full opacity-0 pointer-events-none"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <button
              className={`self-end p-0 absolute top-3 ${
                isArabic ? "left-3" : "right-3"
              } text-secondary hover:text-red-600  cursor-pointer`}
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {/* Logo at the top */}
            <Link
              href="/"
              className="flex items-center justify-center py-6 border-b border-gray-100"
            >
              <Image
                src="/assets/images/logo.webp"
                alt="Logo"
                width={120}
                height={40}
              />
            </Link>

            <nav className="flex-1 flex flex-col gap-2 px-6 mt-4 items-start rtl:items-end">
              {navItems.map((item, idx) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="w-full text-left rtl:text-right"
                  >
                    <button
                      className={`flex items-center justify-between w-full font-instrument-sans text-base font-medium focus:outline-none py-1.5 rounded transition-colors cursor-pointer ${
                        openDropdown === idx
                          ? "text-primary-1"
                          : "text-secondary hover:text-primary-1"
                      }`}
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? null : idx)
                      }
                      aria-expanded={openDropdown === idx}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === idx ? "rotate-180" : "rotate-0"
                        } mr-2 rtl:mr-0 rtl:ml-2`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === idx
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col pl-4 rtl:pl-0 rtl:pr-4">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="text-secondary font-instrument-sans text-base font-medium py-2 rounded transition-colors text-left rtl:text-right"
                            onClick={() => setDrawerOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-secondary font-instrument-sans text-base font-medium py-2 rounded transition-colors w-full text-left rtl:text-right"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <div className="px-6 pb-8 flex flex-col gap-4 mt-auto">
              {profile ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  // href="/investor/login"
                  onClick={handleLogin}
                  className="w-full"
                >
                  {isArabic ? "تسجيل الدخول" : "Log in"}
                </Button>
              )}
              <Button variant="solid" href="/get-started" className="w-full">
                {isArabic ? "ابدأ الآن" : "Get started"}
              </Button>
            </div>
          </div>
        </div>
        <LoginChoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </header>
  );
}
