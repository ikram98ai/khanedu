import { ProfilePage } from "@/components/profile/ProfilePage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return <ProfilePage onBack={handleBack} />;
};

export default Profile;