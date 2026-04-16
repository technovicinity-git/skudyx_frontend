import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/public/assets/icons/icons";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#020202] text-white pt-12 ">
      <div className="container ">
        <div className="flex justify-between gap-6 sm:gap-8 md:gap-12 mb-8 md:mb-10 max-[991]:flex-wrap">
          {/* Left: Logo & Social */}
          <div className="max-[991]:flex-[100%]">
            <Link href={"/"} className="w-[142px] inline-block">
              <Image
                src="/assets/images/logo-white.webp"
                fill
                alt="greenwealth logo"
                className="!relative w-full"
              />
            </Link>
            <p className="text-base font-medium mt-5 md:mt-[30px] max-w-[354px]">
              Connect with us on social media and stay updated with the latest
              news and offers.
            </p>
            <ul className="flex gap-1 gap-y-1.5 mt-6 md:mt-10 sm:flex-nowrap flex-wrap">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1.5 border border-[#EBEBEB] hover:border-primary-1 rounded-full px-4 py-1 hover:bg-primary-1/30 transition"
                >
                  <span className="text-xl">{InstagramIcon}</span>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1.5 border border-[#EBEBEB] hover:border-primary-1 rounded-full px-4 py-1 hover:bg-primary-1/30 transition"
                >
                  <span className="text-xl">{YoutubeIcon}</span>
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1.5 border border-[#EBEBEB] hover:border-primary-1 rounded-full px-4 py-1 hover:bg-primary-1/30 transition"
                >
                  <span className="text-xl">{FacebookIcon}</span>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          {/* Links */}
          <div className="max-[575]:flex-[100%]">
            <h5 className="font-normal mb-2.5 text-base">Company</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-base font-medium text-[#EBEBEB] inline-block hover:text-primary-1 transition whitespace-nowrap"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-base font-medium text-[#EBEBEB] inline-block hover:text-primary-1 transition whitespace-nowrap"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="max-[575]:flex-[100%]">
            <h5 className="font-normal mb-2.5 text-base">Information</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="/blogs"
                  className="text-base font-medium text-[#EBEBEB] inline-block hover:text-primary-1 transition whitespace-nowrap"
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="text-base font-medium text-[#EBEBEB] inline-block hover:text-primary-1 transition whitespace-nowrap"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          {/* Right: App Download */}
          <div className="space-y-4 max-[575]:flex-[100%]">
            <h5 className="font-semibold text-sm">Get the app</h5>
            <a href="#" className="block h-10 w-max">
              <Image
                src="/assets/images/app-store.webp"
                fill
                alt="Download on the App Store"
                className="!relative h-full"
              />
            </a>
            <a href="#" className="block h-10 w-max">
              <Image
                src="/assets/images/play-store.webp"
                fill
                alt="Get it on Google Play"
                className="!relative h-full"
              />
            </a>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-[rgba(235,235,235,.4)] py-4 md:py-5 lg:py-[30px] flex items-center justify-between text-sm text-[#EBEBEB] gap-x-6 gap-y-2 flex-wrap">
          <p className="">
            <span>©Greenwealth. All Rights Reserved. </span>
            <a href="#" className="text-primary-1 hover:underline">
              Licensing
            </a>
          </p>
          <div className="flex items-center gap-1.5 text-primary-1">
            <a href="/terms-and-conditions" className=" hover:underline">
              Terms &amp; Condition
            </a>
            <span className="mx-1">|</span>
            <a href="/privacy-policy" className="hover:underline">
              Privacy policy
            </a>
            <span className="mx-1">|</span>
            <a href="/investment-policies" className="hover:underline">
              Investment policies
            </a>
          </div>
        </div>{" "}
      </div>
    </footer>
  );
};

export default Footer;
