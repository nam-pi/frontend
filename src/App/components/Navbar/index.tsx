import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@headlessui/react";
import { useToggle } from "App/hooks/useToggle";
import { useAuth, useUser } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { NampiLogo } from "../NampiLogo";

const Links = () => (
  <>
    <Link to="/persons" className="hover:opacity-80">
      <FormattedMessage
        description="Persons menu link label"
        defaultMessage="Persons"
      />
    </Link>
  </>
);

export const Navbar = () => {
  const { formatMessage } = useIntl();
  const { authenticated, logout } = useAuth();
  const { initialized, loading, data } = useUser();
  const [mobileMenu, toggleMobileMenu] = useToggle();
  return (
    <nav className="bg-gray-400 text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 hover">
          <div className="flex-1 flex items-center justify-center sm:justify-start">
            <IconButton
              className="absolute left-0 sm:hidden rounded shadow-none border-2 border-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              icon={faBars}
              label={formatMessage({
                description: "Mobile toggle button label",
                defaultMessage: "Open main menu",
              })}
              onClick={toggleMobileMenu}
            />
            <Link to="/" className="font-semibold text-2xl flex items-center">
              <NampiLogo className="h-10 bg-white p-1 rounded" />
              <span className="ml-2 hidden lg:block text-white">Nampi</span>
            </Link>
            <div className="hidden sm:block sm:ml-6">
              <Links />
            </div>
            <div className="absolute right-0">
              {initialized && !loading ? (
                authenticated && data ? (
                  <Menu as="div" className="relative text-gray-800">
                    <Menu.Button className="px-3 py-2 rounded-full border-2 border-white text-white hover:opacity-80 text-sm">
                      <Icon icon={faUser} />
                    </Menu.Button>
                    <Menu.Items className="absolute min-w-max mt-1 right-0 bg-white shadow-lg rounded flex flex-col p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/profile">
                            <FormattedMessage
                              description="User profile link text"
                              defaultMessage="Profile"
                            />
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button type="button" onClick={() => logout()}>
                            <FormattedMessage
                              description="Logout button label"
                              defaultMessage="Log out"
                            />
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <Link
                    to={{
                      pathname: "/login",
                      state: { from: window.location.href },
                    }}
                  >
                    <FormattedMessage
                      description="Login link text"
                      defaultMessage="Log in"
                    />
                  </Link>
                )
              ) : (
                <LoadingPlaceholder />
              )}
            </div>
          </div>
        </div>
      </div>
      {mobileMenu ? (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Links />
          </div>
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
};
