import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import clsx from "clsx";
import { Item } from "nampi-use-api";
import { Link } from "react-router-dom";
import { Icon } from "../Icon";

interface Props {
  classNames?: string;
  item: Item;
}

const getUrl = (item: Item) => {
  if (item.types.includes(namespaces.core.act)) {
    return "/act/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.aspect)) {
    return "/aspect/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.author)) {
    return "/author/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.event)) {
    return "/event/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.group)) {
    return "/group/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.person)) {
    return "/person/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.place)) {
    return "/place/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.source)) {
    return "/source/" + item.idLocal;
  }
  throw new Error("Cannot find URL for item " + item.id);
};

export const ItemLink = ({ classNames, item }: Props) => {
  const getText = useLocaleLiteral();
  return (
    <Link
      className={clsx("inline-block", "hover:opacity-80", classNames)}
      to={getUrl(item)}
    >
      <span>{getText(item.labels)}</span>
      <Icon className="text-xs ml-1 text-blue-500" icon={faLink} />
    </Link>
  );
};
