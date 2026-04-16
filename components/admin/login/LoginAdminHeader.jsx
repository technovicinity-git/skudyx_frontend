import Image from 'next/image';
import Link from 'next/link';

const LoginAdminHeader = () => {
  return (
    <header className="bg-white fixed top-0 w-full">
      <nav className="container min-h-20 !py-4 flex justify-center items-center">
        <Link href="/" className="inline-block">
          <Image
            src="/assets/images/logo.webp"
            alt="greenwealth"
            width={193}
            height={32}
            className="w-[193px] aspect-auto object-contain"
          />
        </Link>
      </nav>
    </header>
  );
};

export default LoginAdminHeader;
