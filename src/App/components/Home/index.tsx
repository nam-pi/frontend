import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";

export const Home = () => (
  <div>
    <Heading>
      <FormattedMessage
        description="The home page heading"
        defaultMessage="Home"
      />
    </Heading>
    <Paragraph>
      <FormattedMessage
        description="The home page content"
        defaultMessage="Welcome."
      />
    </Paragraph>
  </div>
);
