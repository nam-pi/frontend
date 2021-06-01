import { namespaces } from "App/namespaces";
import { GroupsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Label } from "../Label";
import { TypeSelect } from "../TypeSelect";

interface Props {
  query: GroupsQuery;
  setQuery: Dispatch<SetStateAction<GroupsQuery>>;
}

export const GroupsFilterSettings = ({ query, setQuery }: Props) => (
  <FilterSettingsContainer>
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="type-input">
      <FormattedMessage
        description="Group type filter input label"
        defaultMessage="Group type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="type-input"
      onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
      typeBase={namespaces.core.group}
      typeIri={query.type}
    />
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="text-input">
      <FormattedMessage
        description="Group text filter input label"
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
