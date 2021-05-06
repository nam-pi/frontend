import { useUser } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

export const Profile = () => {
  const { initialized, loading, data } = useUser();
  return (
    <div>
      <Heading>
        <FormattedMessage
          description="Profile page label"
          defaultMessage="Profile"
        />
      </Heading>
      {!initialized || loading ? (
        <LoadingPlaceholder />
      ) : (
        <p>{JSON.stringify(data)}</p>
      )}
    </div>
  );
};
