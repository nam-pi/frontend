import { AuthorsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Label } from "../Label";

interface Props {
  query: AuthorsQuery;
  setQuery: Dispatch<SetStateAction<AuthorsQuery>>;
}

export const AuthorsFilterSettings = ({ query, setQuery }: Props) => (
  <FilterSettingsContainer>
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="text-input">
      <FormattedMessage
        description="Author text filter input label"
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
