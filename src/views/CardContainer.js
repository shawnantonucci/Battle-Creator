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

const GETMONSTERSBYUSER = gql`
  query GetMonsterByUserID($id: String!) {
    getMonstersByUser(id: $id) {
      id
      name
      image
      createdBy
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

function CardContainer() {
  const { data: monstersData } = useQuery(GETMONSTERSBYUSER, {
    variables: { id: localStorage.getItem("userUid") },
  });
  // const { data: monstersData } = useQuery(MONSTERS);
  const [monsters, setMonsters] = useState([]);

  const [createMonster] = useMutation(ADDMONSTER);

  useEffect(() => {
    setMonsters(monstersData && Object.values(monstersData));
  }, [monstersData]);

  const monsterByUser = [].concat.apply([], monsters);

  return (
    <div>
      {monsterByUser &&
        monsterByUser.map((monster) => {
          return (
            <div>
              <p>Monster: {monster.name}</p>
              <p>CreatedBy: {monster.createdBy}</p>
              <Logo src={monster.image} />
            </div>
          );
        })}
    </div>
  );
}

export default CardContainer;
