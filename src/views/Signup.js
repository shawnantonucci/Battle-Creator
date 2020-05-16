import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/logo192.png";
import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
} from "../components/AuthForm";
import firebase from "firebase";

function Signup(props) {
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);

  const Signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        setAuth(true);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        setIsError(true);
      });
  };

  if (auth) {
    props.history.push("/");
  }

  return (
    <Card>
      <Logo src={logoImg} />
      <Form>
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={() => Signup()}>Sign Up</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
      {isError && (
        <Error>The username or password provided were incorrect!</Error>
      )}
    </Card>
  );
}

export default Signup;
