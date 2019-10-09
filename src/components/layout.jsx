import React, { useEffect } from "react";
import { Link } from "gatsby";

import "../styles/styles.scss";

const Layout = ({ children }) => {
  return (
    <div id="outer-container">
      <header>
        <div className="header-container">
          <h1>
            Master<span>Currency</span>
          </h1>
          <nav>
            <Link to="/">Converter</Link>
            <Link to="/charts">Charts</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/help">Help</Link>
          </nav>
        </div>
      </header>
      <main id="page-wrap">{children}</main>
    </div>
  );
};

export default Layout;
