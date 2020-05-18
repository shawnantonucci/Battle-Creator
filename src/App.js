import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import Home from "./views/Home";
import User from "./views/User";
import Login from "./views/Login";
import Signup from "./views/Signup";
import CardContainer from "./views/CardContainer";
import CreateMonster from "./views/CreateMonster";

import { AuthContext } from "./context/auth";
import firebase from "firebase";
import config from "./firebase";

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [loggedIn, setLoggedIn] = useState(false);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        const email = user.email;
        const uid = user.uid;

        console.log("Signed In");
        console.log(email);
        console.log(uid);
        setTokens("token");
        setLoggedIn(true);
      } else {
        // User is signed out.
        console.log("Signed Out");
      }
    });
  }, []);

  function logOut() {
    setAuthTokens();
    localStorage.removeItem("tokens");
    Logout();
  }

  const Logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          {loggedIn ? (
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/user">User Page</Link>
              </li>
              <li>
                <Link to="/container">Card List</Link>
              </li>
              <li>
                <Link to="/create-monster">Create Monster</Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    setLoggedIn(false);
                    logOut();
                  }}
                >
                  Log Out
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/login">Log In</Link>
              </li>
            </ul>
          )}
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/user" component={User} />
          <PrivateRoute path="/container" component={CardContainer} />
          <PrivateRoute path="/create-monster" component={CreateMonster} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
