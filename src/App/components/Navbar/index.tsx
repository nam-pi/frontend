import { faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from "@headlessui/react";
import { APP_NAME } from "App/constants";
import { useToggle } from "App/hooks/useToggle";
import clsx from "clsx";
import { useAuth, useUser } from "nampi-use-api";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { NampiLogo } from "../NampiLogo";

interface Props {
  className?: string;
}

const Links = () => (
  <>
    <Link to="/aspects" className="hover:opacity-80">
      <FormattedMessage
        description="Aspects menu link label"
        defaultMessage="Aspects"
      />
    </Link>
    <Link to="/authors" className="hover:opacity-80">
      <FormattedMessage
        description="Authors menu link label"
        defaultMessage="Authors"
      />
    </Link>
    <Link to="/events" className="hover:opacity-80">
      <FormattedMessage
        description="Events menu link label"
        defaultMessage="Events"
      />
    </Link>
    <Link to="/groups" className="hover:opacity-80">
      <FormattedMessage
        description="Groups menu link label"
        defaultMessage="Groups"
      />
    </Link>
    <Link to="/persons" className="hover:opacity-80">
      <FormattedMessage
        description="Persons menu link label"
        defaultMessage="Persons"
      />
    </Link>
    <Link to="/places" className="hover:opacity-80">
      <FormattedMessage
        description="Places menu link label"
        defaultMessage="Places"
      />
    </Link>
    <Link to="/sources" className="hover:opacity-80">
      <FormattedMessage
        description="Sources menu link label"
        defaultMessage="Sources"
      />
    </Link>
  </>
);

export const Navbar = ({ className }: Props) => {
  const { formatMessage } = useIntl();
  const { authenticated, logout } = useAuth();
  const { initialized, loading, data } = useUser();
  const [mobileMenu, toggleMobileMenu] = useToggle();
  return (
    <nav className={clsx("bg-gray-400 text-white", className)}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 items-center justify-between h-16 sm:justify-start">
          <IconButton
            className="sm:hidden rounded shadow-none border-2 border-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
            icon={faBars}
            label={formatMessage({
              description: "Mobile toggle button label",
              defaultMessage: "Open main menu",
            })}
            onClick={toggleMobileMenu}
          />
          <div className="flex">
            <Link
              to="/"
              className="font-semibold text-2xl flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
            >
              <NampiLogo className="h-10 bg-white p-1 rounded" />
            </Link>
            <Link
              to="/"
              className="font-semibold text-2xl flex items-center"
              tabIndex={-1}
            >
              <span className="ml-2 hidden lg:block text-white" tabIndex={-1}>
                {APP_NAME}
              </span>
            </Link>
          </div>
          <div className="hidden sm:block sm:ml-6 space-x-3">
            <Links />
          </div>
          <div className="sm:absolute right-0">
            <div>
              <Link
                className="mr-4 hover:opacity-80 hidden sm:inline-block"
                to="/search"
              >
                <Icon icon={faSearch} />
              </Link>
              {initialized && !loading ? (
                authenticated && data ? (
                  <Menu as="div" className="relative text-gray-800">
                    <Menu.Button className="px-3 py-2 rounded-full border-2 border-white text-white hover:opacity-80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current">
                      <Icon icon={faUser} />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
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
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    className="hover:opacity-80"
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
        <div className="sm:hidden text-lg space-y-1" id="mobile-menu">
          <div className="px-2 pb-3 flex flex-col">
            <Link className="mr-4 hover:opacity-80" to="/search">
              <FormattedMessage
                description="Search link text"
                defaultMessage="Search"
              />
            </Link>
            <Links />
          </div>
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
};
