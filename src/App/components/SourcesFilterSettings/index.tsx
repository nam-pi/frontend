import { namespaces } from "App/namespaces";
import { SourcesQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Label } from "../Label";
import { TypeSelect } from "../TypeSelect";

interface Props {
  query: SourcesQuery;
  setQuery: Dispatch<SetStateAction<SourcesQuery>>;
}

export const SourcesFilterSettings = ({ query, setQuery }: Props) => (
  <FilterSettingsContainer>
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="type-input">
      <FormattedMessage
        description="Source type filter input label"
        defaultMessage="Source type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="type-input"
      onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
      typeBase={namespaces.core.source}
      typeIri={query.type}
    />
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="text-input">
      <FormattedMessage
        description="Source text filter input label"
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
