import { Item } from "App/types";
import { itemPath } from "App/utils/itemPath";
import { Link } from "react-router-dom";

export const ItemListItem = ({
  itemType,
  label,
  localId,
  labelPs = "",
}: { labelPs?: string } & Pick<Item, "itemType" | "label" | "localId">) => (
  <li>
    <Link to={itemPath(itemType, { localId })}>
      {label
        .map((l) => `${l.value}${l.language ? ` [${l.language}]` : ""}`)
        .join(", ") + labelPs}
    </Link>
  </li>
);
