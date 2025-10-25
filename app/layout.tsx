"use client";

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import type { ReactNode } from "react";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Pages that should not display Navbar / padding
  const noNavbarPaths = ["/productsearch", "/admin", "/projectdetail"];
  const hideNavbar = noNavbarPaths.includes(pathname);

  return (
    <html>
      <body>
        <div className="relative">
          <main className={hideNavbar ? "w-full" : "w-full pt-16"}>
            {children}
          </main>

          {!hideNavbar && (
            <div className="absolute top-0 left-0 w-full z-10">
              <Navbar />
            </div>
          )}
        </div>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
