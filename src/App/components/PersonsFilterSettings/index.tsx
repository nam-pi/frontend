import { namespaces } from "App/namespaces";
import { PersonsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Label } from "../Label";
import { TypeSelect } from "../TypeSelect";

interface Props {
  query: PersonsQuery;
  setQuery: Dispatch<SetStateAction<PersonsQuery>>;
}

export const PersonsFilterSettings = ({ query, setQuery }: Props) => (
  <FilterSettingsContainer>
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="type-input">
      <FormattedMessage
        description="Person type filter input label"
        defaultMessage="Person type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="type-input"
      onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
      typeBase={namespaces.core.person}
      typeIri={query.type}
    />
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="text-input">
      <FormattedMessage
        description="Person text filter input label"
        defaultMessage="Text"
      />
    </Label>
    <Input
      className="col-span-4"
      id="text-input"
      value={query.text}
      onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
    />
  </FilterSettingsContainer>
);
