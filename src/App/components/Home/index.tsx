import { ItemType } from "App/enums/ItemType";
import { itemPath } from "App/utils/itemPath";
import { Link } from "react-router-dom";

export const Home = () => (
  <div>
    <h1>Home</h1>
    <p>
      Go to the list of <Link to={itemPath(ItemType.Person)}>Persons</Link>
    </p>
  </div>
);
