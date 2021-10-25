import { namespaces } from "App/namespaces";
import { isValid } from "date-fns";
import { EventsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Select } from "../Select";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: EventsQuery;
  setQuery: Dispatch<SetStateAction<EventsQuery>>;
}

interface FormState {
  aspectType: Type;
  end: string;
  participantType: Type;
  participationType: Type;
  start: string;
}

export const EventsFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<FormState>({
    aspectType: { text: "", value: query.aspectType },
    end: query.endDate?.getFullYear().toString() || "",
    participantType: { text: "", value: query.participantType },
    participationType: { text: "", value: query.participationType },
    start: query.startDate?.getFullYear().toString() || "",
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Event text filter label",
          defaultMessage: "Event label and text",
        })}
        help={intl.formatMessage({
          description: "Event text filter help",
          defaultMessage:
            "Enter any part of an event's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Event text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Event text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Aspect type help text",
          defaultMessage:
            "Select an aspect type that has to be used in an event for it to be included in the results.",
        })}
        label={intl.formatMessage({
          description: "Aspect type label",
          defaultMessage: "Used aspect type",
        })}
      >
        <TypeInput
          onChange={(aspectType) => {
            setQuery((q) => ({ ...q, aspectType: aspectType.value }));
            setForm((form) => ({ ...form, aspectType }));
          }}
          parent={namespaces.core.aspect}
          placeholder={intl.formatMessage({
            description: "Event filter aspect type placeholder",
            defaultMessage: "Enter and select aspect type",
          })}
          value={form.aspectType}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Participant type help text",
          defaultMessage:
            "Select a type of participant that has to have participated for the event to be included in the results.",
        })}
        label={intl.formatMessage({
          description: "Participant type label",
          defaultMessage: "Participant type",
        })}
      >
        <TypeInput
          onChange={(participantType) => {
            setQuery((q) => ({ ...q, participantType: participantType.value }));
            setForm((form) => ({ ...form, participantType }));
          }}
          parent={namespaces.core.actor}
          placeholder={intl.formatMessage({
            description: "Event filter participant type placeholder",
            defaultMessage: "Enter and select participant type",
          })}
          value={form.participantType}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Participation type help text",
          defaultMessage:
            "Select a type of participation that has to have occured in the event for it to be included in the results.",
        })}
        label={intl.formatMessage({
          description: "Participation type label",
          defaultMessage: "Participation type",
        })}
      >
        <TypeInput
          onChange={(participationType) => {
            setQuery((q) => ({
              ...q,
              participationType: participationType.value,
            }));
            setForm((form) => ({ ...form, participationType }));
          }}
          parent={namespaces.core.hasParticipant}
          placeholder={intl.formatMessage({
            description: "Event filter participation type placeholder",
            defaultMessage: "Enter and select participation type",
          })}
          value={form.participationType}
        />
      </Field>
      <Field
        className="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0"
        help={intl.formatMessage({
          description: "Event filter dates help",
          defaultMessage:
            "Enter either or both a start and end year to include in the list of results. Years have to be entered as a numbe with four digits, for example *0012* for the year *12*",
        })}
        label={intl.formatMessage({
          description: "Event filter years label",
          defaultMessage: "Included years",
        })}
      >
        <Input
          label={intl.formatMessage({
            description: "Event filter start input label",
            defaultMessage: "From",
          })}
          maxLength={7}
          pattern="-?\d{1,6}"
          placeholder={intl.formatMessage({
            description: "Event filter from placeholder",
            defaultMessage: "Enter year",
          })}
          value={form.start}
          onChange={(e) => {
            const start = e.target.value;
            const startDate = new Date(Number(start), 0, 1);
            if (isValid(startDate)) {
              setQuery((q) => ({
                ...q,
                startDate,
              }));
              setForm((form) => ({ ...form, start }));
            }
          }}
        />
        <Input
          label={intl.formatMessage({
            description: "Event filter end input label",
            defaultMessage: "To",
          })}
          maxLength={7}
          pattern="-?\d{1,6}"
          placeholder={intl.formatMessage({
            description: "Event filter to placeholder",
            defaultMessage: "Enter year",
          })}
          value={form.end}
          onChange={(e) => {
            const end = e.target.value;
            const endDate = new Date(Number(end), 0, 1);
            if (isValid(endDate)) {
              setQuery((q) => ({
                ...q,
                endDate,
              }));
              setForm((form) => ({ ...form, end }));
            }
          }}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Event filter sort help",
          defaultMessage: "Select a sorting method for the events.",
        })}
        label={intl.formatMessage({
          description: "Event sort label",
          defaultMessage: "Result sorting",
        })}
      >
        <Select
          label={intl.formatMessage({
            description: "Order by select label",
            defaultMessage: "Order by",
          })}
          onChange={(v) => setQuery((q) => ({ ...q, orderBy: v.value as any }))}
          options={[
            { value: "label", text: "Label" },
            { value: "date", text: "Date" },
          ]}
          selected={query.orderBy}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
