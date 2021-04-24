import { Menu } from "@headlessui/react";
import { useKeycloak } from "@react-keycloak/web";
import { ItemType } from "App/enums/ItemType";
import { useProfile } from "App/hooks/useProfile";
import { itemPath } from "App/utils/itemPath";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { keycloak } = useKeycloak();
  const profile = useProfile();
  return (
    <nav className="relative flex items-center justify-between flex-wrap  bg-gray-500 p-3">
      <div className="space-x-3 text-white">
        <Link to="/" className="font-semibold text-2xl">
          <FormattedMessage
            description="Home link text"
            defaultMessage="NAMPI"
          />
        </Link>
        <Link to={itemPath(ItemType.Person)}>
          <FormattedMessage
            description="Persons link text"
            defaultMessage="Persons"
          />
        </Link>
      </div>
      <div>
        {keycloak.authenticated ? (
          <Menu as="div" className="relative">
            <Menu.Button className="px-4 py-2 rounded bg-white">
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
          <div>
            <Link to="/login">
              <FormattedMessage
                description="Login link text"
                defaultMessage="Login"
              />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
