import {
    faBars,
    faPlus,
    faQuestion,
    faSearch,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { APP_NAME, EXTERNAL_DOCS } from "App/constants";
import { useToggle } from "App/hooks/useToggle";
import clsx from "clsx";
import { useAuth, useUser } from "nampi-use-api";
import { Fragment, ReactNode, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { AppLogo } from "../AppLogo";
import { Icon } from "../Icon";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  className?: string;
}

const HighlightLink = ({
  className,
  invert = false,
  to,
  ...props
}: LinkProps & { invert?: boolean }) => {
  const { pathname } = useLocation();
  return (
    <Link
      {...props}
      to={to}
      className={clsx(
        className,
        typeof to === "string" &&
          pathname.startsWith(
            to.includes("?") ? to.substring(0, to.indexOf("?")) : to
          ) &&
          (invert ? "text-blue-300" : "text-blue-500"),
        "hover:opacity-80"
      )}
    />
  );
};

const MenuItem = ({
  action,
  children,
  highlight = true,
  label,
}: {
  children: ReactNode;
  action: string | VoidFunction;
  highlight?: boolean;
  label?: string;
}) => (
  <Menu.Item>
    <div className="hover:bg-gray-100 w-full px-3 py-1">
      {typeof action === "string" ? (
        highlight ? (
          <HighlightLink className="inline-block w-full" to={action}>
            {children}
          </HighlightLink>
        ) : (
          <Link className="inline-block w-full" to={action}>
            {children}
          </Link>
        )
      ) : (
        <button
          className="inline-block w-full text-left"
          type="button"
          onClick={action}
          aria-label={label}
        >
          {children}
        </button>
      )}
    </div>
  </Menu.Item>
);

const NavMenu = ({
  buttonContent,
  buttonLabel,
  children,
  className,
  to,
}: {
  buttonContent: ReactNode;
  buttonLabel?: string;
  children: ReactNode | ReactNode[];
  className?: string;
  to?: string;
}) => {
  const { pathname } = useLocation();
  return (
    <Menu
      as="div"
      className={clsx(
        "relative text--800",
        to &&
          pathname.startsWith(
            to.includes("?") ? to.substring(0, to.indexOf("?")) : to
          )
          ? "text-blue-200"
          : "text-white",
        className
      )}
    >
      <Menu.Button
        className="hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
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
        <Menu.Items className="absolute min-w-8 mt-1 right-0 bg-white opacity-100 text-gray-900 shadow-lg rounded flex flex-col pt-2 pb-4">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const EntityLinks = () => (
  <>
    <HighlightLink invert to="/events">
      <FormattedMessage
        description="Events menu link label"
        defaultMessage="Events"
      />
    </HighlightLink>
    <HighlightLink invert to="/persons">
      <FormattedMessage
        description="Persons menu link label"
        defaultMessage="Persons"
      />
    </HighlightLink>
    <HighlightLink invert to="/groups">
      <FormattedMessage
        description="Groups menu link label"
        defaultMessage="Groups"
      />
    </HighlightLink>
    <HighlightLink invert to="/places">
      <FormattedMessage
        description="Places menu link label"
        defaultMessage="Places"
      />
    </HighlightLink>
    <HighlightLink invert to="/aspects">
      <FormattedMessage
        description="Aspects menu link label"
        defaultMessage="Aspects"
      />
    </HighlightLink>
    <HighlightLink invert to="/sources">
      <FormattedMessage
        description="Sources menu link label"
        defaultMessage="Sources"
      />
    </HighlightLink>
    <HighlightLink invert to="/authors">
      <FormattedMessage
        description="Authors menu link label"
        defaultMessage="Authors"
      />
    </HighlightLink>
  </>
);

const EditMenu = () => {
  const intl = useIntl();
  return (
    <NavMenu
      buttonContent={<FontAwesomeIcon icon={faPlus} />}
      buttonLabel={intl.formatMessage({
        description: "New items button label",
        defaultMessage: "Toggle the new items menu",
      })}
    >
      <MenuItem
        action="/events?edit"
        highlight={false}
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
        highlight={false}
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
        highlight={false}
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
        highlight={false}
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
        highlight={false}
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
        highlight={false}
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

const Brand = () => (
  <div className="flex">
    <Link
      to="/"
      className="font-semibold text-2xl flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
    >
      <AppLogo className="h-10 bg-white p-1 rounded" />
    </Link>
    <Link
      to="/"
      className="font-semibold text-2xl flex items-center"
      tabIndex={-1}
    >
      <span className="ml-2 hidden lg:block text-white uppercase" tabIndex={-1}>
        {APP_NAME}
      </span>
    </Link>
  </div>
);

const DesktopLinks = () => (
  <div className="hidden sm:block sm:ml-6 space-x-3">
    <EntityLinks />
  </div>
);

const ProfileMenu = () => {
  const { logout } = useAuth();
  const intl = useIntl();
  return (
    <NavMenu
      to="/profile"
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
  );
};

const MobileToggleButton = ({
  toggleMobileMenu,
}: {
  toggleMobileMenu: VoidFunction;
}) => {
  const intl = useIntl();
  return (
    <button
      className="sm:hidden bg-transparent text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
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
  );
};

const SearchLink = () => {
  const intl = useIntl();
  return (
    <HighlightLink
      invert
      title={intl.formatMessage({
        description: "Desktop search link title text",
        defaultMessage: "Go to search",
      })}
      to="/search"
    >
      <Icon icon={faSearch} />
    </HighlightLink>
  );
};

const InfoMenu = () => {
  const intl = useIntl();
  return (
    <NavMenu
      buttonContent={<Icon icon={faQuestion} />}
      buttonLabel={intl.formatMessage({
        description: "Info button menu",
        defaultMessage: "Info",
      })}
      to="/info"
    >
      {EXTERNAL_DOCS.about && (
        <MenuItem action="/info/about">
          <FormattedMessage
            description="About link text"
            defaultMessage="About"
          />
        </MenuItem>
      )}
      {EXTERNAL_DOCS.data && (
        <MenuItem action="/info/data">
          <FormattedMessage
            description="Data link text"
            defaultMessage="Data"
          />
        </MenuItem>
      )}
      {EXTERNAL_DOCS.dataModel && (
        <MenuItem action="/info/data-model">
          <FormattedMessage
            description="Data model link text"
            defaultMessage="Data model"
          />
        </MenuItem>
      )}
      <MenuItem action="/info/imprint">
        <FormattedMessage
          description="Imprint link text"
          defaultMessage="Imprint"
        />
      </MenuItem>
      {EXTERNAL_DOCS.dataModel && (
        <MenuItem action="/info/privacy">
          <FormattedMessage
            description="Privacy link text"
            defaultMessage="Privacy"
          />
        </MenuItem>
      )}
    </NavMenu>
  );
};

const RightMenu = ({
  toggleMobileMenu,
}: {
  toggleMobileMenu: VoidFunction;
}) => {
  const { authenticated } = useAuth();
  const { initialized, loading, data } = useUser();
  return (
    <div className="sm:absolute right-0 flex flex-row items-center space-x-4">
      {authenticated && data && <EditMenu />}
      <SearchLink />
      <InfoMenu />
      {initialized && !loading ? (
        authenticated && data && <ProfileMenu />
      ) : (
        <LoadingPlaceholder />
      )}
      <MobileToggleButton toggleMobileMenu={toggleMobileMenu} />
    </div>
  );
};

const MobileMenu = () => {
  const { pathname } = useLocation();
  return (
    <div className="sm:hidden text-lg space-y-1" id="mobile-menu">
      <div className="px-2 pb-3 flex flex-col">
        <Link
          className={clsx(
            pathname.startsWith("/search") && "text-blue-100",
            "mr-4 hover:opacity-80"
          )}
          to="/search"
        >
          <FormattedMessage
            description="Search link text"
            defaultMessage="Search"
          />
        </Link>
        <EntityLinks />
      </div>
    </div>
  );
};

export const Navbar = ({ className }: Props) => {
  const { pathname } = useLocation();
  const oldPath = useRef(pathname);
  const [mobileMenu, toggleMobileMenu] = useToggle();
  useEffect(() => {
    if (pathname !== oldPath.current && mobileMenu) {
      oldPath.current = pathname;
      toggleMobileMenu();
    }
  }, [pathname, mobileMenu, toggleMobileMenu]);
  return (
    <nav
      className={clsx(
        "bg-gray-400 border-b-4 border-blue-400 text-white",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 items-center justify-between h-16 sm:justify-start">
          <Brand />
          <DesktopLinks />
          <RightMenu toggleMobileMenu={toggleMobileMenu} />
        </div>
      </div>
      {mobileMenu ? <MobileMenu /> : <></>}
    </nav>
  );
};
