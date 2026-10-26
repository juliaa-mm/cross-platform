export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    occasion: String
    color: String
    inStock: Boolean!
    owner: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    me: User
    products: [Product!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createProduct(
      name: String!
      description: String!
      price: Float!
      occasion: String
      color: String
    ): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;
