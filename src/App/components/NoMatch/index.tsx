import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export const NoMatch = () => (
  <div>
    <h1>
      <FormattedMessage
        description="No match page header"
        defaultMessage="Error"
      />
    </h1>
    <p>
      <FormattedMessage
        description="The text of the no match page"
        defaultMessage="Page not found, go back to <a>Home</a>"
        values={{
          a: (m: string) => <Link to="/">{m}</Link>,
        }}
      />
    </p>
  </div>
);
