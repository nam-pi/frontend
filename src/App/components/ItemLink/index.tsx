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
  createText?: (labels: Item["labels"]) => string;
}

const getUrl = (item: Item) => {
  if (item?.types?.includes(namespaces.core.act)) {
    return "/acts/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.aspect)) {
    return "/aspects/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.author)) {
    return "/authors/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.event)) {
    return "/events/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.group)) {
    return "/groups/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.person)) {
    return "/persons/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.place)) {
    return "/places/" + item.idLocal;
  } else if (item.types.includes(namespaces.core.source)) {
    return "/sources/" + item.idLocal;
  }
  throw new Error("Cannot find URL for item " + item.id);
};

export const ItemLink = ({ classNames, createText, item }: Props) => {
  const getText = useLocaleLiteral();
  return (
    <Link
      className={clsx("inline-block", "hover:opacity-80", classNames)}
      to={getUrl(item)}
    >
      <span>{(createText || getText)(item.labels)}</span>
      <Icon className="text-xs ml-1 text-blue-400" icon={faLink} />
    </Link>
  );
};
