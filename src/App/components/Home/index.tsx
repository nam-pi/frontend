import { ItemType } from "App/enums/ItemType";
import { itemPath } from "App/utils/itemPath";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export const Home = () => (
  <div>
    <h1>
      <FormattedMessage
        description="The heading for the home page"
        defaultMessage="Home"
      />
    </h1>
    <p>
      <FormattedMessage
        description="The text of the home page"
        defaultMessage="Go to the list of <a>Persons</a>"
        values={{
          a: (m: string) => <Link to={itemPath(ItemType.Person)}>{m}</Link>,
        }}
      />
    </p>
  </div>
);
