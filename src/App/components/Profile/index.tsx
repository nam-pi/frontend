import { useProfile } from "App/hooks/useProfile";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";

export const Profile = () => {
  const profile = useProfile();
  return (
    <div>
      <Heading>
        <FormattedMessage
          description="Profile page heading"
          defaultMessage="Profile"
        />
      </Heading>
      <p>{JSON.stringify(profile)}</p>
    </div>
  );
};
