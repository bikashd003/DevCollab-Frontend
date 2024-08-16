import ProfileDetails from "../Components/Profile/ProfileDetails";
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../GraphQL/Queries/Users'

const Profile = () => {
  const { loading, error, data } = useQuery(GET_USER_DATA);

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
