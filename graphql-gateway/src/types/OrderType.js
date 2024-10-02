const { GraphQLObjectType, GraphQLString } = require('graphql');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    _id: { type: GraphQLString },
    productId: { type: GraphQLString },
    userId: { type: GraphQLString },
    quantity: { type: GraphQLString }
  })
});

module.exports = OrderType;
