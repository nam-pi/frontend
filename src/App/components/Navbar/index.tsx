import {
    faBars,
    faPlus,
    faSearch,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { APP_NAME } from "App/constants";
import { useToggle } from "App/hooks/useToggle";
import clsx from "clsx";
import { useAuth, useUser } from "nampi-use-api";
import { Fragment, ReactNode, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../Icon";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { NampiLogo } from "../NampiLogo";

interface Props {
  className?: string;
}

const MenuItem = ({
  action,
  children,
  label,
}: {
  children: ReactNode;
  action: string | VoidFunction;
  label?: string;
}) => (
  <Menu.Item>
    {(active) => (
      <div className="hover:bg-gray-100">
        {typeof action === "string" ? (
          <Link to={action}>{children}</Link>
        ) : (
          <button type="button" onClick={action} aria-label={label}>
            {children}
          </button>
        )}
      </div>
    )}
  </Menu.Item>
);
const NavMenu = ({
  buttonContent,
  buttonLabel,
  children,
  className,
}: {
  buttonContent: ReactNode;
  buttonLabel?: string;
  children: ReactNode | ReactNode[];
  className?: string;
}) => (
  <Menu as="div" className={clsx("relative text-gray-800", className)}>
    <Menu.Button
      className="text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
      aria-label={buttonLabel}
    >
      {buttonContent}
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
      <Menu.Items className="absolute min-w-8 mt-1 right-0 bg-white shadow-lg rounded flex flex-col px-3 pt-2 pb-4 space-y-1">
        {children}
      </Menu.Items>
    </Transition>
  </Menu>
);
const Links = () => (
  <>
    <Link to="/events" className="hover:opacity-80">
      <FormattedMessage
        description="Events menu link label"
        defaultMessage="Events"
      />
    </Link>
    <Link to="/persons" className="hover:opacity-80">
      <FormattedMessage
        description="Persons menu link label"
        defaultMessage="Persons"
      />
    </Link>
    <Link to="/groups" className="hover:opacity-80">
      <FormattedMessage
        description="Groups menu link label"
        defaultMessage="Groups"
      />
    </Link>
    <Link to="/places" className="hover:opacity-80">
      <FormattedMessage
        description="Places menu link label"
        defaultMessage="Places"
      />
    </Link>
    <Link to="/aspects" className="hover:opacity-80">
      <FormattedMessage
        description="Aspects menu link label"
        defaultMessage="Aspects"
      />
    </Link>
    <Link to="/sources" className="hover:opacity-80">
      <FormattedMessage
        description="Sources menu link label"
        defaultMessage="Sources"
      />
    </Link>
    <Link to="/authors" className="hover:opacity-80">
      <FormattedMessage
        description="Authors menu link label"
        defaultMessage="Authors"
      />
    </Link>
  </>
);

const EditMenu = () => {
  const intl = useIntl();
  return (
    <NavMenu
      buttonContent={<FontAwesomeIcon className="mr-4" icon={faPlus} />}
      buttonLabel={intl.formatMessage({
        description: "New items button label",
        defaultMessage: "Toggle the new items menu",
      })}
    >
      <MenuItem
        action="/events?edit"
        label={intl.formatMessage({
          description: "Create events item label",
          defaultMessage: "Create new event",
        })}
      >
        <FormattedMessage
          description="New event button label"
          defaultMessage="New event"
        />
      </MenuItem>
      <MenuItem
        action="/persons?edit"
        label={intl.formatMessage({
          description: "Create persons item label",
          defaultMessage: "Create new person",
        })}
      >
        <FormattedMessage
          description="New person button label"
          defaultMessage="New person"
        />
      </MenuItem>
      <MenuItem
        action="/groups?edit"
        label={intl.formatMessage({
          description: "Create groups item label",
          defaultMessage: "Create new group",
        })}
      >
        <FormattedMessage
          description="New group button label"
          defaultMessage="New group"
        />
      </MenuItem>
      <MenuItem
        action="/places?edit"
        label={intl.formatMessage({
          description: "Create places item label",
          defaultMessage: "Create new place",
        })}
      >
        <FormattedMessage
          description="New place button label"
          defaultMessage="New place"
        />
      </MenuItem>
      <MenuItem
        action="/aspects?edit"
        label={intl.formatMessage({
          description: "Create aspects item label",
          defaultMessage: "Create new aspect",
        })}
      >
        <FormattedMessage
          description="New aspect button label"
          defaultMessage="New aspect"
        />
      </MenuItem>
      <MenuItem
        action="/sources?edit"
        label={intl.formatMessage({
          description: "Create sources item label",
          defaultMessage: "Create new source",
        })}
      >
        <FormattedMessage
          description="New source button label"
          defaultMessage="New source"
        />
      </MenuItem>
    </NavMenu>
  );
};

export const Navbar = ({ className }: Props) => {
  const { pathname } = useLocation();
  const oldPath = useRef(pathname);
  const intl = useIntl();
  const { authenticated, logout } = useAuth();
  const { initialized, loading, data } = useUser();
  const [mobileMenu, toggleMobileMenu] = useToggle();
  useEffect(() => {
    if (pathname !== oldPath.current && mobileMenu) {
      oldPath.current = pathname;
      toggleMobileMenu();
    }
  }, [pathname, mobileMenu, toggleMobileMenu]);
  return (
    <nav className={clsx("bg-gray-400", "text-white", className)}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 items-center justify-between h-16 sm:justify-start">
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
          <div className="sm:absolute right-0 flex flex-row items-center">
            <button
              className="sm:hidden bg-transparent mr-4 text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label={intl.formatMessage({
                description: "Mobile toggle button label",
                defaultMessage: "Toggle main menu",
              })}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            {authenticated && data && <EditMenu />}
            <Link
              className="mr-4 hover:opacity-80 hidden sm:inline-block"
              title={intl.formatMessage({
                description: "Desktop search link title text",
                defaultMessage: "Go to search",
              })}
              to="/search"
            >
              <Icon icon={faSearch} />
            </Link>
            {initialized && !loading ? (
              authenticated && data ? (
                <NavMenu
                  buttonContent={<Icon icon={faUserCircle} />}
                  buttonLabel={intl.formatMessage({
                    description: "Profile menu button label",
                    defaultMessage: "Toggle profile menu",
                  })}
                >
                  <MenuItem action="/profile">
                    <FormattedMessage
                      description="User profile link text"
                      defaultMessage="Profile"
                    />
                  </MenuItem>
                  <MenuItem
                    action={logout}
                    label={intl.formatMessage({
                      description: "Logout button label",
                      defaultMessage: "Log out of user account",
                    })}
                  >
                    <FormattedMessage
                      description="Logout button label"
                      defaultMessage="Log out"
                    />
                  </MenuItem>
                </NavMenu>
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
