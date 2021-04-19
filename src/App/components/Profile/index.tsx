import { useProfile } from "App/hooks/useProfile";

export const Profile = () => {
  const profile = useProfile();
  return (
    <div>
      <h1>Profile</h1>
      <p>{JSON.stringify(profile)}</p>
    </div>
  );
};
