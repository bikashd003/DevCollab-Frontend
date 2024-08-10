import ProfileDetails from "../Components/ProfileDetails";
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
  console.log(contact)
    return (
      <div className="flex">
        <RightSidebar />
        <div className="flex-grow">
          <ProfileDetails />
        </div>
      </div>
    );
  };

export default Profile;
