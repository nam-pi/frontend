import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { Hierarchy } from "nampi-use-api";
import { Icon } from "../Icon";

interface Props {
  path: string[];
  allItems: Hierarchy["items"];
}

export const InheritancePath = ({ path, allItems }: Props) => {
  const getText = useLocaleLiteral();
  return (
    <>
      {path.map((item, idx) => (
        <div key={item} className="inline-block text-xs">
          <span>{getText(allItems[item].labels)}</span>
          {idx < path.length - 1 ? (
            <Icon className="mx-2 text-gray-500" icon={faCaretRight} />
          ) : (
            ""
          )}
        </div>
      ))}
    </>
  );
};
