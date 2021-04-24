import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";

export const NoMatch = () => (
  <div>
    <Heading>
      <FormattedMessage
        description="No match page header"
        defaultMessage="Error"
      />
    </Heading>
    <Paragraph>
      <FormattedMessage
        description="The text of the no match page"
        defaultMessage="Page not found, go back to <a>Home</a>"
        values={{
          a: (m: string) => <Link to="/">{m}</Link>,
        }}
      />
    </Paragraph>
  </div>
);
