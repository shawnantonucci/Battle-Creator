import React from "react";
import ReactDOM from "react-dom";
import "./antd.css"
// import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import App from "./App";

const link = new HttpLink({
  uri: "http://localhost:4000/graphiql",
  // uri: "https://battle-creator.herokuapp.com/",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMSIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTU4ODM5MTI5OCwiZXhwIjoxNTkwOTgzMjk4fQ.SrCXpEfepO_OY5FLz0MIvu1gxs0Un7E49BewrftKBrY`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
