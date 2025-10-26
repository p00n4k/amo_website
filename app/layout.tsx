"use client";

import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const noNavbarPaths = ["/productsearch", "/admin", "/projectdetail"];
  const hideNavbar = noNavbarPaths.includes(pathname);

  return (
    <html>
      <body className="bg-white">
        {/* ✅ ปรับให้อยู่ใน flow ปกติ ไม่ใช้ absolute */}
        {!hideNavbar && (
          <div className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm">
            <Navbar />
          </div>
        )}

        {/* ✅ ไม่เว้นขาวด้านบนอีกต่อไป */}
        <main className={hideNavbar ? "w-full" : "w-full"}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
};

export default Layout;
