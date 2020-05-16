import React from "react";
import firebase from "firebase";

function Home(props) {
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
    <div>
      <p>Home Page</p>
      <button onClick={() => Logout()}>Log Out</button>
    </div>
  );
}

export default Home;
