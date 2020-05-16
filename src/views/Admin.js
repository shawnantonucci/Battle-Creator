import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import firebase from "firebase";
import { useQuery } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const MONSTERS = gql`
  {
    monsters {
      id
      name
      health
      attacks {
        name
        dmg
      }
    }
  }
`;

const ADDMONSTER = gql`
  mutation {
    createMonster(
      name: "Joe"
      health: 100
      attacks: [{ name: "Swing", dmg: 50 }]
    ) {
      id
      name
      health
      attacks {
        name
        dmg
      }
    }
  }
`;

function Admin(props) {
  const { setAuthTokens } = useAuth();
  const { data } = useQuery(MONSTERS);
  const [monsters, setMonsters] = useState();
  const [updateMonsters, setUpdateMonsters] = useState(false);

  useEffect(() => {
    setMonsters(data && Object.values(data.monsters));
  }, [data, ADDMONSTER]);

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
    <div>
      <div>Admin Page</div>
      {monsters &&
        monsters.map((monster) => {
          return <div>{monster.name}</div>;
        })}
      <button onClick={() => logOut()}>Log out</button>
      <Mutation mutation={ADDMONSTER} refetchQueries={[{ query: MONSTERS }]}>
        {(createMonsterMutation) => (
          <button onClick={() => createMonsterMutation()}>Add Monster</button>
        )}
      </Mutation>
    </div>
  );
}

export default Admin;
