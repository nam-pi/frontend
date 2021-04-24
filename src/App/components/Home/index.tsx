import { ItemType } from "App/enums/ItemType";
import { itemPath } from "App/utils/itemPath";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { Link } from "../Link";
import { Paragraph } from "../Paragraph";

export const Home = () => (
  <div>
    <Heading>
      <FormattedMessage
        description="The heading for the home page"
        defaultMessage="Home"
      />
    </Heading>
    <Paragraph>
      <FormattedMessage
        description="The text of the home page"
        defaultMessage="Go to the list of <a>Persons</a>"
        values={{
          a: (m: string) => <Link to={itemPath(ItemType.Person)}>{m}</Link>,
        }}
      />
    </Paragraph>
  </div>
);
