import { useKeycloak } from "@react-keycloak/web";
import { ItemType } from "App/enums/ItemType";
import { useProfile } from "App/hooks/useProfile";
import { itemPath } from "App/utils/itemPath";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

export const Navbar = () => {
  const { keycloak } = useKeycloak();
  const profile = useProfile();
  return (
    <ul>
      <li>
        <Link to="/">
          <FormattedMessage
            description="Home link text"
            defaultMessage="Home"
          />
        </Link>
      </li>
      <li>
        <Link to={itemPath(ItemType.Person)}>
          <FormattedMessage
            description="Persons link text"
            defaultMessage="Persons"
          />
        </Link>
      </li>
      {keycloak.authenticated ? (
        profile ? (
          <>
            <li>
              <Link to="/profile">
                <FormattedMessage
                  description="Profile link text"
                  defaultMessage="Profile: {username}"
                  values={{ username: profile?.username }}
                />
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => keycloak.logout()}>
                <FormattedMessage
                  description="Logout button text"
                  defaultMessage="Logout"
                />
              </button>
            </li>
          </>
        ) : (
          <LoadingPlaceholder />
        )
      ) : (
        <li>
          <Link to="/login">
            <FormattedMessage
              description="Login link text"
              defaultMessage="Login"
            />
          </Link>
        </li>
      )}
    </ul>
  );
};
