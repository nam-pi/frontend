import { useKeycloak } from "@react-keycloak/web";
import { ItemType } from "App/enums/ItemType";
import { useProfile } from "App/hooks/useProfile";
import { itemPath } from "App/utils/itemPath";
import { Link } from "react-router-dom";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

export const Navbar = () => {
  const { keycloak } = useKeycloak();
  const profile = useProfile();
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to={itemPath(ItemType.Person)}>Persons</Link>
      </li>
      {keycloak.authenticated ? (
        profile ? (
          <>
            <li>
              <Link to="/profile">Profile: {profile?.username}</Link>
            </li>
            <li>
              <button type="button" onClick={() => keycloak.logout()}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <LoadingPlaceholder />
        )
      ) : (
        <li>
          <Link to="/login">Login</Link>
        </li>
      )}
    </ul>
  );
};
