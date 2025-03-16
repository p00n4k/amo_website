import React from "react";
import "./Navbar.css";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-content">
                    {/* Left navigation */}
                    <div className="navbar-left">
                        <a href="#" className="nav-link">Home</a>
                        <a href="#" className="nav-link">Product</a>
                        <a href="#" className="nav-link">Project</a>
                    </div>

                    {/* Middle Logo */}
                    <div className="navbar-logo">
                        <div className="logo-text">Amo</div>
                    </div>

                    {/* Right navigation */}
                    <div className="navbar-right">
                        {/* Line Icon with hover effect */}
                        <a href="#" className="icon-link group">
                            <img src="/images/line.png" alt="Line Logo" className="icon" />
                            <span className="hidden_line">
                                amocorner
                            </span>
                        </a>

                        {/* Get in Touch Button */}
                        <a href="#" className="cta-button">Get in touch</a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
