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
import { Avatar } from "antd";

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

function CardContainer(props) {
  const { data: monstersData } = useQuery(GETMONSTERSBYUSER, {
    variables: { id: localStorage.getItem("userUid") },
  });
  console.log("CardContainer -> monstersData", monstersData)
  const [monsters, setMonsters] = useState([]);
  
  const [createMonster] = useMutation(ADDMONSTER);

  useEffect(() => {
    setMonsters(monstersData && Object.values(monstersData));
    console.log("setMonsters", setMonsters)
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
              <Avatar
                shape="square"
                size="small"
                icon={<Logo src={monster.image} />}
              />
            </div>
          );
        })}
    </div>
  );
}

export default CardContainer;
