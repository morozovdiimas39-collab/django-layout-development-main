'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Упс! Страница не найдена</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
