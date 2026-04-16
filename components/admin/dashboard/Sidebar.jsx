"use client";
import DropdownMenu from "@/components/common/DropdownMenu";
import { useSidebar } from "@/components/common/SidebarContext";

import {
  HomeIcon,
  ManagementIcon,
  QuestionCircleIcon,
  SettingsIcon,
  UsersIcon,
} from "@/public/assets/icons/icons";
// import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

// Navigation items factory function
const createNavItems = (basePath) => {
  const isAdmin = basePath === "admin";
  const isAgent = basePath === "agent";
  if (isAdmin) {
    return [
      {
        label: "Dashboard",
        href: "/admin",
        icon: HomeIcon,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: UsersIcon,
      },
      {
        label: "Support Agent",
        href: "/admin/agents",
        icon: UsersIcon,
      },

      {
        label: "Case",
        children: [
          {
            label: "Pending Cases",
            href: "/admin/cases/pending-cases",
          },
          {
            label: "In Progress Cases",
            href: "/admin/cases/inprogress-cases",
          },

          {
            label: "Escalated Cases",
            href: "/admin/cases/escalated-cases",
          },
          {
            label: "Resolved Cases",
            href: "/admin/cases/resolved-cases",
          },
          {
            label: "Unresolved Cases",
            href: "/admin/cases/unresolved-cases",
          },
          {
            label: "False Cases",
            href: "/admin/cases/false-cases",
          },
          {
            label: "Basic Cases",
            href: "/admin/cases/basic-cases",
          },
        ],
        icon: ManagementIcon,
      },
      // { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ];
  }

  if (isAgent) {
    return [
      {
        label: "Pending Cases",
        href: "/agent/pending-cases",
        icon: ManagementIcon,
      },
      {
        label: "Active Case",
        href: "/agent/active-case",
        icon: ManagementIcon,
      },
      {
        label: "Case History",
        href: "/agent/case-history",
        icon: ManagementIcon,
      },
    ];
  }

  // Default empty array if no valid basePath
  return [];
};

const Sidebar = ({ basePath = "admin" }) => {
  const currentPath = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const navItems = createNavItems(basePath);
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // const { logout } = useLogout({
  //   onSuccess: () => {
  //     Cookies.remove("accessToken", { path: "/" });
  //     Cookies.remove("refreshToken", { path: "/" });
  //     Cookies.remove("accessLevel", { path: "/" });
  //     router.push(`/${basePath}/login`);
  //   },
  //   onError: (error) => {
  //     console.error("Logout failed", error);
  //   },
  // });

  // const handleLogout = () => {
  //   logout();
  //   Cookies.remove("accessToken", { path: "/" });
  //   Cookies.remove("refreshToken", { path: "/" });
  //   Cookies.remove("accessLevel", { path: "/" });
  // };

  React.useEffect(() => {
    // Auto-open dropdown if current path matches any child, but only if no dropdown is currently open
    const match = navItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => currentPath === child.href),
    );
    if (match && !openDropdown) {
      setOpenDropdown(match.label);
    }
  }, [currentPath, navItems, openDropdown]);

  const handleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <aside
        className={`h-screen flex flex-col w-[280px] fixed lg:sticky left-0 top-0 transition-transform duration-300 ease-in-out z-50 bg-white  border-r border-r-gray-200 pt-2 lg:pt-8"
         ${
           isSidebarOpen
             ? "translate-x-0"
             : "-translate-x-full lg:translate-x-0"
         }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="inline-block max-w-full mx-6 pointer-events-none"
        >
          <Image
            src={"/assets/images/logo-small.png"}
            fill
            alt=""
            className="!relative"
          />
        </Link>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 mt-6 [scrollber-Width: thin;]">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.label} className="">
                {item.children ? (
                  <DropdownMenu
                    item={item}
                    currentPath={currentPath}
                    open={openDropdown === item.label}
                    onToggle={() => handleDropdown(item.label)}
                    basePath={basePath}
                  />
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center text-[#8A8A8A] gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-base font-medium group hover:bg-[#406DA41A] hover:text-black
                    ${currentPath === item.href ? "bg-[#406DA41A] text-black" : ""}
                  `}
                  >
                    <span
                      className={`w-5 h-8 ${currentPath === item.href ? "text-black" : ""}`}
                    >
                      {item.icon}
                    </span>
                    <span className=" h-8">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {basePath === "admin" && (
          <div className={`px-4 py-2 `}>
            <Link href={`/${basePath}/settings`}>
              <div
                className={
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-base font-medium cursor-pointer text-[#8A8A8A] hover:bg-[#406DA41A] hover:text-black"
                }
              >
                {SettingsIcon}
                Settings
              </div>
            </Link>
          </div>
        )}
        {basePath === "admin" && (
          <div className={`px-4 py-2 `}>
            <Link href={`/${basePath}/help-center`}>
              <div
                className={
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-base font-medium cursor-pointer text-[#8A8A8A] hover:bg-[#406DA41A] hover:text-black"
                }
              >
                {QuestionCircleIcon}
                Help & Support
              </div>
            </Link>
          </div>
        )}

        {/* Logout */}
        {/* <div className={`px-4 py-2 `}>
          <button
            className={
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-base font-medium cursor-pointer text-[#1B1C1E] hover:bg-[#F5F5F5] hover:text-[#406DA41A]"
            }
            onClick={() => {
              handleLogout();
            }}
          >
            {LogOutIcon}
            Log Out
          </button>
        </div> */}
        {/* <style jsx global>{`
        .menu-parent {
          transition: color 0.2s;
        }
        ${isInvestor
          ? `
          .menu-parent.text-[#1B1C1E]:hover,
          .menu-parent.group-hover\\:text-[#406DA41A]:hover,
          .menu-parent.open {
            color: #406DA41A !important;
          }
          `
          : `
          .menu-parent.text-[#BDBDBD]:hover,
          .menu-parent.group-hover\\:text-white:hover,
          .menu-parent.open {
            color: #fff !important;
          }
          `}
             `}</style> */}
      </aside>
    </>
  );
};

export default Sidebar;
