import { useProfile } from "App/hooks/useProfile";
import { FormattedMessage } from "react-intl";

export const Profile = () => {
  const profile = useProfile();
  return (
    <div>
      <h1>
        <FormattedMessage
          description="Profile page heading"
          defaultMessage="Profile"
        />
      </h1>
      <p>{JSON.stringify(profile)}</p>
    </div>
  );
};
