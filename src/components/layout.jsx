import React, { useEffect } from "react";
import { Link } from "gatsby";

import withFirebaseAuth from "react-with-firebase-auth";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../utilities/firebaseConfig";
import "../styles/styles.scss";

let firebaseApp;
let firebaseAppAuth;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}
if (typeof window !== "undefined") {
  firebaseAppAuth = firebaseApp.auth();
}
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

const Layout = ({ children, user, signOut, signInWithGoogle }) => {
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
            <div className="authentication">
              {user ? (
                <a onClick={signOut}>Logout</a>
              ) : (
                <a onClick={signInWithGoogle}>Login</a>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main id="page-wrap">{children}</main>
    </div>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(Layout);
