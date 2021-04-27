import { Menu } from "@headlessui/react";
import { useKeycloak } from "@react-keycloak/web";
import { ItemType } from "App/enums/ItemType";
import { useProfile } from "App/hooks/useProfile";
import { itemPath } from "App/utils/itemPath";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { NampiLogo } from "../NampiLogo";

export const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();
  const [profile, loading] = useProfile();
  return (
    <nav className="relative flex items-center justify-between flex-wrap  bg-gray-400 p-3 text-white">
      <div className="space-x-3 text-white flex items-center">
        <Link to="/" className="font-semibold text-2xl">
          <NampiLogo className="h-10 bg-white p-1 rounded" />
        </Link>
        <Link to={itemPath(ItemType.Person)}>
          <FormattedMessage
            description="Persons link text"
            defaultMessage="Persons"
          />
        </Link>
      </div>
      <div>
        {initialized && !loading ? (
          profile ? (
            <Menu as="div" className="relative text-gray-800">
              <Menu.Button className="px-4 py-2 rounded bg-white text-sm">
                {profile?.username}
              </Menu.Button>
              <Menu.Items className="absolute min-w-max mt-1 right-0 bg-white shadow-lg rounded flex flex-col p-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link to="/profile">
                      <FormattedMessage
                        description="Profile link text"
                        defaultMessage="Profile"
                      />
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button type="button" onClick={() => keycloak.logout()}>
                      <FormattedMessage
                        description="Logout button text"
                        defaultMessage="Logout"
                      />
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <Link
              to={{ pathname: "/login", state: { from: window.location.href } }}
            >
              <FormattedMessage
                description="Login link text"
                defaultMessage="Login"
              />
            </Link>
          )
        ) : (
          <LoadingPlaceholder />
        )}
      </div>
    </nav>
  );
};
