import { namespaces } from "App/namespaces";
import { EventsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Label } from "../Label";
import { Select } from "../Select";
import { TypeSelect } from "../TypeSelect";

interface Props {
  query: EventsQuery;
  setQuery: Dispatch<SetStateAction<EventsQuery>>;
}

export const EventsFilterSettings = ({ query, setQuery }: Props) => (
  <FilterSettingsContainer>
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="sort-select">
      <FormattedMessage
        description="Order by filter input label"
        defaultMessage="Order by"
      />
    </Label>
    <Select
      className="col-span-4"
      id="sort-select"
      onChange={(v) => setQuery((q) => ({ ...q, orderBy: v.value as any }))}
      options={[
        { value: "label", text: "Label" },
        { value: "date", text: "Date" },
      ]}
      selected={query.orderBy}
    />
    <Label
      className="col-span-2 sm:flex sm:items-center"
      htmlFor="aspect-type-input"
    >
      <FormattedMessage
        description="Used aspect type filter input label"
        defaultMessage="Aspect type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="aspect-type-input"
      onChange={(id) => setQuery((q) => ({ ...q, aspectType: id }))}
      typeBase={namespaces.core.aspect}
      typeIri={query.aspectType}
    />
    <Label
      className="col-span-2 sm:flex sm:items-center"
      htmlFor="participant-type-input"
    >
      <FormattedMessage
        description="Used participant type filter input label"
        defaultMessage="Participant type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="participant-type-input"
      onChange={(id) => setQuery((q) => ({ ...q, participantType: id }))}
      typeBase={namespaces.core.agent}
      typeIri={query.participantType}
    />
    <Label
      className="col-span-2 sm:flex sm:items-center"
      htmlFor="participation-type-input"
    >
      <FormattedMessage
        description="Used participation type filter input label"
        defaultMessage="Participation type"
      />
    </Label>
    <TypeSelect
      className="col-span-4"
      id="participation-type-input"
      onChange={(id) => setQuery((q) => ({ ...q, participationType: id }))}
      typeBase={namespaces.core.hasParticipant}
      typeIri={query.participationType}
    />
    <Label className="col-span-2 sm:flex sm:items-center" htmlFor="text-input">
      <FormattedMessage
        description="Event text filter input label"
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
