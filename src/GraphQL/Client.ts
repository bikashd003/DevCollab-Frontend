import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
// import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Create the http link
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
});

// Error handling link
// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
//     );
//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

// Retry link
const retryLink = new RetryLink({
  attempts: {
    max: 3,
    retryIf: error => !!error,
  },
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Add type policies here if needed
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
