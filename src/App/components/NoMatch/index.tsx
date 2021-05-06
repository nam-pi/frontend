import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { Link } from "../Link";
import { Paragraph } from "../Paragraph";

export const NoMatch = () => (
  <div>
    <Heading>
      <FormattedMessage
        description="No match page heading"
        defaultMessage="Error"
      />
    </Heading>
    <Paragraph>
      <FormattedMessage
        description="No match page content"
        defaultMessage="Page not found, go back to <a>Home</a>"
        values={{ a: (msg: string) => <Link to="/">{msg}</Link> }}
      />
    </Paragraph>
  </div>
);
