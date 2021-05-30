import { useAct } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { Heading } from "../Heading";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLink } from "../ItemLink";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
}

export const ActDetails = ({ idLocal }: Props) => {
  const { formatList, formatDate } = useIntl();
  const { data } = useAct({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Act heading"
          defaultMessage="Document interpretation act"
        />
      </Heading>
      <ItemInheritance iri={data.id} />
      <ul>
        <li>
          <FormattedMessage
            description="Author text"
            defaultMessage="{authorCount, plural, one {Author} other {Authors}}: {authors}"
            values={{
              authorCount: data.authors.length,
              authors: formatList(
                data.authors.map((a) => <ItemLink key={a.id} item={a} />),
                { type: "conjunction" }
              ),
            }}
          />
        </li>
        <li>
          <FormattedMessage
            description="Authoring date text"
            defaultMessage="Authoring date: {date}"
            values={{
              date: formatDate(data.date, { dateStyle: "long" }),
            }}
          />
        </li>
        <li>
          <FormattedMessage
            description="Source text"
            defaultMessage="Source: {source}, {location}"
            values={{
              source: <ItemLink item={data.sourceLocation.source} />,
              location: data.sourceLocation.text,
            }}
          />
        </li>
        <li>
          <FormattedMessage
            description="Interpretation text"
            defaultMessage="Interpretation: {interpretation}"
            values={{
              interpretation: <ItemLink item={data.interpretation} />,
            }}
          />
        </li>
      </ul>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
