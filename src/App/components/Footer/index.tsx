import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EXTERNAL_LOGOS } from "App/constants";
import { useAuth } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

const LoginLink = () => (
  <Link
    className="hover:opacity-80 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
    to={{
      pathname: "/login",
      state: { from: window.location.href },
    }}
  >
    <FormattedMessage description="Login link text" defaultMessage="Log in" />
  </Link>
);

const Logos = () => {
  const intl = useIntl();
  return (
    <div className="flex py-1 sm:w-full md:w-auto flex-wrap">
      {EXTERNAL_LOGOS.map(([url, src], idx) => (
        <a
          key={idx}
          href={url}
          target="__blank"
          className="p-1 my-1 mr-2 bg-white rounded items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
        >
          <img
            alt={intl.formatMessage(
              { description: "Logo alt text", defaultMessage: "Logo {idx}" },
              { idx }
            )}
            className="object-contain h-10"
            src={src}
          />
        </a>
      ))}
    </div>
  );
};

export const Footer = () => {
  const { authenticated } = useAuth();
  return (
    <aside className="bg-gray-400 border-t-4 border-blue-400 text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 items-center md:justify-between flex-wrap py-2 sm:justify-start">
          <Logos />
          <div className="space-x-4 flex items-center">
            <a
              className="rounded-sm items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
              href="https://github.com/nam-pi"
              target="__blank"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            {!authenticated && <LoginLink />}
          </div>
        </div>
      </div>
    </aside>
  );
};
