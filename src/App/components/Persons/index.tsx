import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { usePersons } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { serializeEventDates } from "../../utils/serializeEventDates";
import { Heading } from "../Heading";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { ItemNav } from "../ItemNav";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

export const Persons = () => {
  const getText = useLocaleLiteral();
  const [text, setText] = useState<string>("");
  const { initialized, loading, data, nav, total, page } = usePersons({
    query: { orderBy: "label", text },
  });
  return (
    <div>
      <Heading>
        {total === undefined ? (
          <FormattedMessage
            description="Persons page heading without totals"
            defaultMessage="Persons"
          />
        ) : (
          <FormattedMessage
            description="Persons page heading with totals"
            defaultMessage="Persons ({total})"
            values={{ total }}
          />
        )}
      </Heading>
      <div className="my-4">
        <Icon icon={faSearch} />
        <Input
          className="ml-2"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        ></Input>
      </div>
      <ItemNav
        className="my-4"
        disabled={!initialized || loading}
        nav={nav}
        page={page}
      />
      {!initialized || !data ? (
        <LoadingPlaceholder />
      ) : (
        <ul>
          {data.map((person) => {
            const label = getText(person.labels);
            const born = serializeEventDates(person.bornIn, "Y");
            return (
              <li key={person.idLocal}>
                <Link to={"person/" + person.idLocal} className="text-gray-800">
                  {label + (born ? ` (${born})` : "")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
