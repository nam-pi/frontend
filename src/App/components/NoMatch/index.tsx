import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { Link } from "../Link";
import { PageContent } from "../PageContent";
import { Paragraph } from "../Paragraph";

export const NoMatch = () => (
  <PageContent className="flex-col space-y-4 max-w-3xl">
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
  </PageContent>
);
