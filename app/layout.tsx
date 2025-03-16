import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (

    <html>
      <body>
        <div className="relative">
          <main className="w-full">{children}</main>
          <div className="absolute top-0 left-0 w-full z-10">
            <Navbar />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;