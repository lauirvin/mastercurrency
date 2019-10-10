import React, { useEffect } from "react";
import { Link } from "gatsby";

import "../styles/styles.scss";

const Layout = ({ children }) => {
  useEffect(() => {
    const tag = document.getElementsByTagName("a");
    Array.from(tag).forEach((element, i) => {
      if (element.innerHTML === children[0].props.title) {
        tag[i].classList.add("selected");
      }
    });
  });
  
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
