import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/logo192.png";
import { Card, Logo, Form, Input, Button, Error } from "../components/AuthForm";
import firebase from "firebase";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const USER = gql`
  mutation CreateUser($name: String!, $id: String!, $email: String!) {
    createUser(name: $name, id: $id, email: $email) {
      id
      name
      email
    }
  }
`;

function Signup(props) {
  const [isError, setIsError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidate, setPasswordValidate] = useState("");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState();

  const [createUser] = useMutation(USER);

  useEffect(() => {
    setUser(localStorage.getItem("userUid"));
  }, []);

  const Signup = () => {
    if (password !== passwordValidate) {
      setIsPasswordError(true);
    } else {
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
      AddCreatedUser();
    }
  };

  const AddCreatedUser = () => {
    if (firebase.auth().currentUser) {
      const userUid = firebase.auth().currentUser.uid;
      localStorage.setItem("userUid", userUid);
    }
    const uuid = localStorage.getItem("userUid");

    createUser({
      variables: {
        id: uuid,
        email: email,
        name: name,
      },
    });
  };

  if (auth) {
    props.history.push("/");
  }

  return (
    <Card>
      <h1>Signup</h1>
      <Logo src={logoImg} />
      <Form>
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <Input
          type="password"
          placeholder="Re-enter Password"
          onChange={(e) => setPasswordValidate(e.target.value)}
        />
        <Button onClick={() => Signup()}>Sign Up</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
      {isError && (
        <Error>The username or password provided were incorrect!</Error>
      )}
      {isPasswordError && <Error>Passwords do not match try again...</Error>}
    </Card>
  );
}

export default Signup;
