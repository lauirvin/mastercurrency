import React from "react"
import { Link } from "gatsby"

import withFirebaseAuth from "react-with-firebase-auth"
import * as firebase from "firebase/app"
import "firebase/auth"
import firebaseConfig from "../utilities/firebaseConfig"
import { push as Menu } from "react-burger-menu"

import "../styles/styles.scss"

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}

const Layout = ({ children, user, signOut, signInWithGoogle }) => {
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
          <nav>
            <Link to="/">Home</Link>
            <Link to="/page2">Page 2</Link>
          </nav>
          <div className="authentication">
            {user ? (
              <button onClick={signOut}>Sign out</button>
            ) : (
              <button onClick={signInWithGoogle}>Sign in</button>
            )}
          </div>
        </div>
      </header>
      <main id="page-wrap">
        {children[1]}
        {user ? <h2>Welcome {user.displayName}</h2> : <h2> Please sign in </h2>}
        {children.slice(2)}
      </main>
    </div>
  )
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Layout)
