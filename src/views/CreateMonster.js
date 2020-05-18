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
  mutation CreateMonster(
    $name: String!
    $health: Int!
    $image: String!
    $createdBy: String!
  ) {
    createMonster(
      name: $name
      health: $health
      image: $image
      createdBy: $createdBy
    ) {
      id
      name
      health
      image
      createdBy
    }
  }
`;

function CreateMonster() {
  const { data: monstersData } = useQuery(MONSTERS);
  const [monsters, setMonsters] = useState();
  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const [health, setHealth] = useState(0);
  const [monsterImage, setMonsterImage] = useState();
  const [isError, setIsError] = useState(false);
  const [createMonster] = useMutation(ADDMONSTER);

  // if (firebase.auth().currentUser) {
  //   const userUid = firebase.auth().currentUser.uid;
  //   localStorage.setItem("userUid", userUid);
  // }

  useEffect(() => {
    setUser(localStorage.getItem("userUid"));
  }, []);

  console.log(user);

  useEffect(() => {
    setMonsters(monstersData && Object.values(monstersData.monsters));
  }, [monstersData]);

  const AddCreatedMonster = () => {
    if (!name || !health) {
      setIsError(true);
    } else {
      createMonster({
        variables: {
          name: name,
          health: health,
          image: monsterImage,
          createdBy: user,
        },
        refetchQueries: [{ query: MONSTERS }],
      });
    }
  };

  const handleFiles = (files) => {
    console.log(files);
    setMonsterImage(files.base64);
  };

  return (
    <Card>
      <Logo src={monsterImage} />
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
  );
}

export default CreateMonster;
