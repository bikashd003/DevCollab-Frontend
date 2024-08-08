import RightSidebar from "../Components/RightSidebar";
import { useQuery, gql } from '@apollo/client';

const GET_CONTACT = gql`
  query GetContact($contactId: ID!) {
    contact(id: $contactId) {
      country
      pincode
      id
      city
    }
  }
`;

const Profile = () => {
  const contactId = "66b51712ff43e67d16887784"; 
  const { loading, error, data } = useQuery(GET_CONTACT, {
    variables: { contactId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { contact } = data;

  return (
    <>
      <RightSidebar />
      <div>
        <h2>Contact Details</h2>
        <p>Country: {contact.country}</p>
        <p>Pincode: {contact.pincode}</p>
        <p>ID: {contact.id}</p>
        <p>City: {contact.city}</p>
      </div>
    </>
  );
};

export default Profile;
