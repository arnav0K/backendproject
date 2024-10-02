const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } = require('graphql');
const User = require('./user.model'); // User model
const Product = require('./product.model'); // Product model
const Order = require('./order.model'); // Order model

// Define input types for mutations
const RegisterInput = new GraphQLInputObjectType({
  name: 'RegisterInput',
  fields: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString }
  }
});

const ProductInput = new GraphQLInputObjectType({
  name: 'ProductInput',
  fields: {
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    inventory: { type: GraphQLString }
  }
});

const OrderInput = new GraphQLInputObjectType({
  name: 'OrderInput',
  fields: {
    productId: { type: GraphQLID },
    userId: { type: GraphQLID },
    quantity: { type: GraphQLString }
  }
});

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

// Product Type
const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    inventory: { type: GraphQLString }
  })
});

// Order Type
const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    productId: { type: GraphQLID },
    quantity: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find(); // Fetch all users
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id); // Fetch a specific user by ID
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find(); // Fetch all products
      }
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findById(args.id); // Fetch a specific product by ID
      }
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find(); // Fetch all orders
      }
    },
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Order.findById(args.id); // Fetch a specific order by ID
      }
    }
  }
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    registerUser: {
      type: GraphQLString,
      args: {
        input: { type: RegisterInput }
      },
      resolve: async (parent, { input }) => {
        const user = new User(input);
        await user.save();
        return 'User registered successfully!';
      }
    },
    createProduct: {
      type: GraphQLString,
      args: {
        input: { type: ProductInput }
      },
      resolve: async (parent, { input }) => {
        const product = new Product(input);
        await product.save();
        return 'Product created successfully!';
      }
    },
    placeOrder: {
      type: GraphQLString,
      args: {
        input: { type: OrderInput }
      },
      resolve: async (parent, { input }) => {
        const order = new Order(input);
        await order.save();
        return 'Order placed successfully!';
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
