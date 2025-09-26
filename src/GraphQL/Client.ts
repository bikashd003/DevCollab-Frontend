import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import BackendApi from '../Constant/Api';

// Create the http link
const httpLink = createHttpLink({
  uri: `${BackendApi}/graphql`,
  credentials: 'include',
});

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
  cache: new InMemoryCache({}),
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
