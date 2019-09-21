import React, { useEffect } from "react";
import { Link } from "gatsby";
import { push as Menu } from "react-burger-menu";

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
      <Menu right pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <Link to="/">Home</Link>
        <Link to="/page2">Page 2</Link>
        <div className="authentication">
          {user ? (
            <button onClick={signOut}>Sign out</button>
          ) : (
            <button onClick={signInWithGoogle}>Sign in</button>
          )}
        </div>
      </Menu>
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
      <main id="page-wrap">
        {children}
        {/* {user ? <h2>Welcome {user.displayName}</h2> : <h2> Please sign in </h2>} */}
      </main>
    </div>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(Layout);
