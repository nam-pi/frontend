import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import {
    LiteralString,
    Person,
    usePerson,
    usePersonUpdate
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { Button } from "../Button";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { TextRepeater } from "../TextRepeater";
import { TypeInput } from "../TypeInput";

interface Props {
  idLocal?: string;
}

const serializeLiteral = (literals: undefined | LiteralString[]) =>
  (literals || []).map(
    (t) => `${t.value}${t.language ? `@${t.language}` : ""}`
  );

const Editor = ({ person }: { person: Person }) => {
  const history = useHistory();
  const intl = useIntl();
  const [form, setForm] = useState<Person>(person);
  const [mutate, { data, loading }] = usePersonUpdate(person.idLocal);
  useEffect(() => {
    if (!loading && data) {
      history.push("/persons/" + person.idLocal);
    }
  }, [data, history, loading, person.idLocal]);
  return (
    <form className="grid grid-flow-row gap-4">
      <Field
        label={intl.formatMessage({
          description: "Person type field label",
          defaultMessage: "Person type",
        })}
      >
        <TypeInput
          onChange={(v) => v && setForm((old) => ({ ...old, types: [v] }))}
          parent="https://purl.org/nampi/owl/core#person"
          value={form.types[form.types.length - 1]}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Labels field label",
          defaultMessage: "Labels",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Label input label",
            defaultMessage: "Label",
          })}
          onChange={(labels) => setForm((old) => ({ ...old, labels }))}
          values={form.labels}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Text field label",
          defaultMessage: "Text",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Text input label",
            defaultMessage: "Texts",
          })}
          onChange={(texts) => setForm((old) => ({ ...old, texts }))}
          values={form.texts}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Sameas field label",
          defaultMessage: "Same as URLs",
        })}
      >
        <TextRepeater
          label={intl.formatMessage({
            description: "Sameas input label",
            defaultMessage: "Same as",
          })}
          onChange={(sameAs) => setForm((old) => ({ ...old, sameAs }))}
          values={form.sameAs}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Comments field label",
          defaultMessage: "Comments",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Comment input label",
            defaultMessage: "Comment",
          })}
          onChange={(comments) => setForm((old) => ({ ...old, comments }))}
          type="multiline"
          values={form.comments}
        />
      </Field>
      <div className="flex justify-start">
        <Button
          disabled={loading}
          onClick={() =>
            mutate({
              type: form.types[form.types.length - 1],
              texts: serializeLiteral(form.texts),
              comments: serializeLiteral(form.comments),
              labels: serializeLiteral(form.labels),
            })
          }
        >
          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : (
            <FormattedMessage
              description="Submit button label"
              defaultMessage="Submit"
            />
          )}
        </Button>
        <Button
          className="ml-4"
          onClick={() => history.push("/persons/" + person.idLocal)}
        >
          <FormattedMessage
            description="Cancel button label"
            defaultMessage="Cancel"
          />
        </Button>
      </div>
    </form>
  );
};

export const PersonEditor = ({ idLocal }: Props) => {
  const { data } = usePerson({ idLocal: idLocal || "", paused: !idLocal });
  const literal = useLocaleLiteral();
  const create = idLocal === undefined;
  return data ? (
    <>
      <Heading>
        {create ? (
          <FormattedMessage
            description="Create person heading"
            defaultMessage="Create new person"
          />
        ) : (
          <FormattedMessage
            description="New person heading"
            defaultMessage="Edit {person}"
            values={{ person: literal(data.labels) }}
          />
        )}
      </Heading>
      <Editor person={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
