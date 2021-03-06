import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import logoImg from "../img/logo192.png";
import { Card, Logo, Form, Input, Button, Error } from "../components/AuthForm";
import { useAuth } from "../context/auth";
import firebase from "firebase";

function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("shawn@gmail.com");
  const [password, setPassword] = useState("123456");
  const [auth, setAuth] = useState(false);
  const referer = "/" || props.location.state.referer;

  const Login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        if (firebase.auth().currentUser) {
          const userUid = firebase.auth().currentUser.uid;
          localStorage.setItem("userUid", userUid);
        }
        const uuid = localStorage.getItem("userUid");
        setAuth(true);
      })
      .catch(function (error) {
        console.log(error.code);
        console.log(error.message);
      });
  };

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  if (auth) {
    console.log("logged in");
    props.history.push("/");
  }

  return (
    <Card>
      <h1>Login</h1>
      <Logo src={logoImg} />
      <Form>
        <Input
          type="username"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
        />
        <Input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <Button onClick={() => Login()}>Login</Button>
      </Form>
      <Link to="/signup">Don't have an account?</Link>
      {isError && (
        <Error>The username or password provided were incorrect!</Error>
      )}
    </Card>
  );
}

export default Login;
