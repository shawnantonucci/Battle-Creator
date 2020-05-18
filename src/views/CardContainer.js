import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import firebase from "firebase";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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
  console.log("monsterByUser", monsterByUser)

  return (
    <div>
      {monsterByUser &&
        monsterByUser.map((monster) => {
          return (
            <div>
              <p>{monster.name}</p>
              <p>{monster.createdBy}</p>
              <img style={{ width: 100, height: 100 }} src={monster.image} />
            </div>
          );
        })}
    </div>
  );
}

export default CardContainer;
