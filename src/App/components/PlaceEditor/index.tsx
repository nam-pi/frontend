import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import {
    LiteralString,
    Place,
    usePlace,
    usePlaceCreate,
    usePlaceUpdate
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { Input } from "../Input";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { TextRepeater } from "../TextRepeater";
import { Type } from "../TypeInput";
import { TypeRepeater } from "../TypeRepeater";

interface Props {
  idLocal?: string;
}

interface FormState {
  comments: undefined | LiteralString[];
  labels: undefined | LiteralString[];
  latitude: undefined | string;
  longitude: undefined | string;
  sameAs: undefined | string[];
  texts: undefined | LiteralString[];
}

const validate = (form: FormState, types: Type[]) =>
  types.length > 0 &&
  (form.labels?.length || 0) > 0 &&
  ((form?.latitude === undefined && form?.longitude === undefined) ||
    (!Number.isNaN(form?.latitude) &&
      !Number.isNaN(Number.parseFloat(form?.latitude || "")) &&
      !Number.isNaN(form?.longitude) &&
      !Number.isNaN(Number.parseFloat(form?.longitude || ""))));

const useForm = (
  baseUrl: string,
  defaultType: string,
  place: undefined | Place
) => {
  const history = useHistory();
  const [form, setForm] = useState<FormState>({
    comments: place?.comments,
    labels: place?.labels,
    sameAs: place?.sameAs,
    texts: place?.texts,
    latitude: String(place?.latitude),
    longitude: String(place?.longitude),
  });
  const [types, setTypes] = useEditorTypes(
    place ? { itemId: place.id } : { defaultType }
  );
  const update = usePlaceUpdate(place?.idLocal || "");
  const create = usePlaceCreate();
  let mutate = create[0];
  let state = create[1];
  if (place) {
    mutate = update[0];
    state = update[1];
  }
  useEffect(() => {
    if (!state.loading && state.data) {
      window.location.assign(baseUrl + state.data.idLocal);
    }
  }, [baseUrl, history, state, state.data, state.loading]);
  return { form, setForm, types, setTypes, mutate, state };
};

const Editor = ({ place }: { place?: Place }) => {
  const defaultType = namespaces.core.place;
  const baseUrl = "/places/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    place
  );
  return (
    <EditorForm>
      {state.error && (
        <Paragraph className="italic p-2 rounded bg-red-500 text-white">
          <span>
            <FormattedMessage
              description="Error heading"
              defaultMessage="Error"
            />
          </span>
          :&nbsp;
          {literal(state.error.description)}
        </Paragraph>
      )}
      <Field
        label={intl.formatMessage({
          description: "Place type field label",
          defaultMessage: "Place types *",
        })}
      >
        <TypeRepeater onChange={setTypes} parent={defaultType} values={types} />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Labels field label",
          defaultMessage: "Labels *",
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
          description: "Coordinates field label",
          defaultMessage: "Coordinates",
        })}
      >
        <div className="flex flex-col md:flex-row w-full">
          <Input
            label={intl.formatMessage({
              description: "Latitude input label",
              defaultMessage: "Lat",
            })}
            onChange={(e) =>
              setForm((old) => ({ ...old, latitude: e.target.value }))
            }
            value={form.latitude || ""}
          />
          <Input
            className="mt-4 md:mt-0 md:ml-4"
            label={intl.formatMessage({
              description: "Longitude input label",
              defaultMessage: "Lng",
            })}
            onChange={(e) =>
              setForm((old) => ({ ...old, longitude: e.target.value }))
            }
            value={form.longitude || ""}
          />
        </div>
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
      <EditorControls
        cancelUrl={baseUrl + (place?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            comments: serializeLiteral(form.comments),
            labels: serializeLiteral(form.labels),
            latitude: form.latitude,
            longitude: form.longitude,
            sameAs: form.sameAs,
            texts: serializeLiteral(form.texts),
            types: types.map((t) => t.value || ""),
          })
        }
        valid={validate(form, types)}
      />
    </EditorForm>
  );
};

export const PlaceEditor = ({ idLocal }: Props) => {
  const { data, initialized, loading } = usePlace({
    idLocal: idLocal || "",
    paused: !idLocal,
  });
  const literal = useLocaleLiteral();
  const create = idLocal === undefined;
  return initialized && !loading ? (
    <>
      <Heading>
        {create ? (
          <FormattedMessage
            description="Create place heading"
            defaultMessage="Create new place"
          />
        ) : (
          <FormattedMessage
            description="New place heading"
            defaultMessage="Edit {place}"
            values={{ place: literal(data?.labels) }}
          />
        )}
      </Heading>
      <Editor place={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};