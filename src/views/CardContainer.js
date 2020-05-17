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
  const { data: monstersData } = useQuery(MONSTERS);
  const [monsters, setMonsters] = useState();

  const [createMonster] = useMutation(ADDMONSTER);

  useEffect(() => {
    setMonsters(monstersData && Object.values(monstersData.monsters));
  }, [monstersData]);

  return (
    <div>
      {monsters &&
        monsters.map((monster) => {
          return (
            <div>
              <p>{monster.name}</p>
              <img style={{ width: 100, height: 100 }} src={monster.image} />
            </div>
          );
        })}
    </div>
  );
}

export default CardContainer;
