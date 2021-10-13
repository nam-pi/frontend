import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useUser } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";

export const Profile = () => {
  const { initialized, loading, data } = useUser();
  const literal = useLocaleLiteral();
  return (
    <div className="space-y-4">
      <Heading>
        <FormattedMessage
          description="Profile page heading"
          defaultMessage="Welcome, {user}"
          values={{ user: data?.username }}
        />
      </Heading>
      {!initialized || loading ? (
        <LoadingPlaceholder />
      ) : (
        <Paragraph>
          <FormattedMessage
            description="Profile page text"
            defaultMessage="Your email address is {email} and your author page is {author}."
            values={{
              email: <span className="text-gray-500">{data?.email}</span>,
              author: (
                <Link
                  className="text-gray-500"
                  to={`/authors/${data?.author?.idLocal}`}
                >
                  {literal(data?.labels)}
                  <FontAwesomeIcon
                    className="text-blue-500 text-xs ml-1"
                    icon={faLink}
                  />
                </Link>
              ),
            }}
          />
        </Paragraph>
      )}
    </div>
  );
};
