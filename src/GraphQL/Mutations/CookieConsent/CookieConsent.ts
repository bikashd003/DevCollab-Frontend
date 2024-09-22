import { gql } from '@apollo/client';

export const SET_COOKIE_CONSENT = gql`
  mutation setCookieConsent($consent: String!) {
    setCookieConsent(consent: $consent)
  }
`;
//TODO: need to add cookie consent resolver in backend also
