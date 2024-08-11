import ProfileDetails from "../Components/Profile/ProfileDetails";
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
  console.log(contact)
    return (
      <div className=" h-full">
        <ProfileDetails />
      </div>
    );
  };

export default Profile;
