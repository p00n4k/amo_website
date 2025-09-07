"use client";

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import type { ReactNode } from "react";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isProductSearchPage = pathname === "/productsearch";

  return (
    <html>
      <body>
        <div className="relative">
          <main className={isProductSearchPage ? "w-full" : "w-full pt-16"}>
            {children}
          </main>

          {!isProductSearchPage && (
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
