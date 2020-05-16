import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import firebase from "firebase";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
} from "../components/MonsterForm";
import ReactFileReader from "react-file-reader";

const USER = gql`
  {
    users(id: "user-0") {
      id
      name
      cards {
        name
      }
    }
  }
`;

const USERS = gql`
  {
    users {
      id
      name
      cards {
        name
      }
    }
  }
`;

const ADDUSER = gql`
  mutation {
    createUser(name: "New User") {
      id
      name
    }
  }
`;

const MONSTERS = gql`
  {
    monsters {
      id
      name
      health
      image
      attacks {
        name
      }
    }
  }
`;

const ADDMONSTER = gql`
  mutation CreateMonster($name: String!, $health: Int!, $image: String!) {
    createMonster(name: $name, health: $health, image: $image) {
      id
      name
      health
      image
    }
  }
`;

const ATTACKS = gql`
  {
    attacks {
      id
      name
      dmg
    }
  }
`;

const ADDATTACK = gql`
  mutation {
    createAttack(name: "Slice", dmg: 10) {
      id
      name
      dmg
    }
  }
`;

function Admin(props) {
  const { setAuthTokens } = useAuth();
  const { data: usersData } = useQuery(USERS);
  const { data: monstersData } = useQuery(MONSTERS);
  const { data: attacksData } = useQuery(ATTACKS);
  const [monsters, setMonsters] = useState();
  const [attacks, setAttacks] = useState();
  const [users, setUsers] = useState();
  const [monsterImage, setMonsterImage] = useState();

  const [createMonster] = useMutation(ADDMONSTER);

  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [health, setHealth] = useState(0);

  useEffect(() => {
    setUsers(usersData && Object.values(usersData.users));
    setMonsters(monstersData && Object.values(monstersData.monsters));
    setAttacks(attacksData && Object.values(attacksData.attacks));
  }, [monstersData, attacksData, usersData]);

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

  const AddCreatedMonster = () => {
    if (!name || !health) {
      setIsError(true);
    } else {
      createMonster({
        variables: { name: name, health: health, image: monsterImage },
        refetchQueries: [{ query: MONSTERS }],
      });
    }
  };

  const handleFiles = (files) => {
    console.log(files.base64);
    setMonsterImage(files.base64);
  };

  return (
    <div>
      <div>Admin Page</div>
      <Card>
        {/* <Logo src={monsterImage} /> */}
        <img style={{ width: 100, height: 100 }} src={monsterImage} />
        <Form>
          <label for="file">Choose a picture for your card</label>
          <ReactFileReader
            fileTypes="image/*"
            base64={true}
            id="file"
            name="file"
            handleFiles={handleFiles}
          >
            <button className="btn">Upload</button>
          </ReactFileReader>

          <Input
            type="text"
            placeholder="Monster Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monster Health"
            onChange={(e) => setHealth(parseInt(e.target.value))}
          />
          <Button onClick={AddCreatedMonster}>Add Monster</Button>
        </Form>
        {isError && <Error>Please enter all fields</Error>}
      </Card>
      {monsters &&
        monsters.map((monster) => {
          return (
            <div>
              <p>monster.name</p>{" "}
              <img style={{ width: 100, height: 100 }} src={monster.image} />
            </div>
          );
        })}
      {attacks &&
        attacks.map((attack) => {
          return <div>{attack.name}</div>;
        })}
      <button onClick={() => logOut()}>Log out</button>
      <Mutation mutation={ADDATTACK} refetchQueries={[{ query: ATTACKS }]}>
        {(createAttackMutation) => (
          <button onClick={() => createAttackMutation()}>Add Attack</button>
        )}
      </Mutation>
    </div>
  );
}

export default Admin;
