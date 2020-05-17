import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import firebase from "firebase";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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

function User(props) {
  const { data: usersData } = useQuery(USERS);
  const { data: attacksData } = useQuery(ATTACKS);
  const [attacks, setAttacks] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    setUsers(usersData && Object.values(usersData.users));
    setAttacks(attacksData && Object.values(attacksData.attacks));
  }, [attacksData, usersData]);

  return (
    <div>
      <div>User Page</div>
      {attacks &&
        attacks.map((attack) => {
          return <div>{attack.name}</div>;
        })}
      <Mutation mutation={ADDATTACK} refetchQueries={[{ query: ATTACKS }]}>
        {(createAttackMutation) => (
          <button onClick={() => createAttackMutation()}>Add Attack</button>
        )}
      </Mutation>
    </div>
  );
}

export default User;
