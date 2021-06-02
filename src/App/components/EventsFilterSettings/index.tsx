import { namespaces } from "App/namespaces";
import { EventsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

export const EventsFilterSettings = ({ query, setQuery }: Props) => {
  const [startDateText, setStartDateText] = useState<string>(
    query.startDate?.getFullYear().toString() || ""
  );
  const [endDateText, setEndDateText] = useState<string>(
    query.endDate?.getFullYear().toString() || ""
  );
  useEffect(() => {
    if (startDateText.length === 4 || endDateText.length === 4) {
      const startDate =
        startDateText.length === 4
          ? new Date(Number.parseInt(startDateText), 0, 1)
          : undefined;
      const endDate =
        endDateText.length === 4
          ? new Date(Number.parseInt(endDateText), 11, 31)
          : undefined;
      setQuery((q) => ({ ...q, startDate, endDate }));
    }
  }, [endDateText, setQuery, startDateText]);
  return (
    <FilterSettingsContainer>
      <Label
        className="col-span-2 sm:flex sm:items-center"
        htmlFor="sort-select"
      >
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
        htmlFor="start-select"
      >
        <FormattedMessage
          description="Starting year select input label"
          defaultMessage="Starting year"
        />
      </Label>
      <Input
        id="start-select"
        maxLength={4}
        pattern="\d*"
        className="col-span-4"
        value={startDateText}
        onChange={(e) => setStartDateText(e.target.value)}
      />
      <Label
        className="col-span-2 sm:flex sm:items-center"
        htmlFor="end-select"
      >
        <FormattedMessage
          description="Ending year select input label"
          defaultMessage="Ending year"
        />
      </Label>
      <Input
        id="end-select"
        maxLength={4}
        pattern="\d*"
        className="col-span-4"
        value={endDateText}
        onChange={(e) => setEndDateText(e.target.value)}
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
      <Label
        className="col-span-2 sm:flex sm:items-center"
        htmlFor="text-input"
      >
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
};
