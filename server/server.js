const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
// const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
// const routes = require('./routes');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// start ApolloServer
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: authMiddleware
  });

  // start the server
  await server.start();

  // integrate the apollo server with Express application as middleware
  server.applyMiddleware({ app });

  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
};

// initialize the server
startServer();

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// added from deep-thoughts
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
