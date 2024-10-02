const { GraphQLObjectType, GraphQLString } = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    price: { type: GraphQLString }
  })
});

module.exports = ProductType;
