import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// Create HTTP link to NestJS GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:3100/graphql',
});

// Create auth link to dynamically add the x-hasura-role header
const authLink = setContext((_, { headers }) => {
  const role = localStorage.getItem('user-role') || 'admin';
  return {
    headers: {
      ...headers,
      'x-hasura-role': role,
    },
  };
});

// Initialize Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false, // simpler for local store updates
  }),
});
