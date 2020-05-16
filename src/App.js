import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./views/Home";
import Admin from "./views/Admin";
import Login from "./views/Login";
import Signup from "./views/Signup";
import { AuthContext } from "./context/auth";
import firebase from "firebase";
import config from "./firebase";

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  useEffect(() => {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        var uid = user.uid;

        console.log("Signed In");
        console.log(email);
        console.log(uid);
        setTokens("token");
      } else {
        // User is signed out.
        console.log("Signed Out");
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          <ul>
            {" "}
            <li>
              <Link to="/">Home Page</Link>
            </li>
            <li>
              <Link to="/admin">Admin Page</Link>
            </li>
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/admin" component={Admin} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
