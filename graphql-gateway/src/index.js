const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.use('/graphql', (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send('Invalid token');
      req.user = user;
    });
  }
  next();
}, graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL Gateway running on port ${PORT}`);
});
