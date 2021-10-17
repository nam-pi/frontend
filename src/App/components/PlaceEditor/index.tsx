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
import { CommentsField } from "../CommentsField";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { FormError } from "../FormError";
import { FormIntroduction } from "../FormIntroduction";
import { Heading } from "../Heading";
import { Input } from "../Input";
import { LabelsField } from "../LabelsField";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { SameAsField } from "../SameAsField";
import { TextsField } from "../TextsField";
import { Type } from "../TypeInput";
import { TypesField } from "../TypesField";

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

const empty = <V,>(value: V | null | undefined): value is V =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.replace(/\s/g, "").length === 0);

const hasValidOptionalCoordinates = (form: FormState): boolean =>
  (empty(form.latitude) && empty(form.longitude)) ||
  (form.latitude?.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/) !== null &&
    form.longitude?.match(
      /[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/
    ) !== null);

const validate = (form: FormState, types: Type[]): boolean =>
  types.length > 0 &&
  (form.labels?.length || 0) > 0 &&
  hasValidOptionalCoordinates(form);

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
    latitude: place?.latitude ? String(place?.latitude) : undefined,
    longitude: place?.longitude ? String(place?.longitude) : undefined,
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
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    place
  );
  return (
    <EditorForm>
      <FormError error={state.error} />
      <TypesField onChange={setTypes} parent={defaultType} values={types} />
      <LabelsField
        onChange={(labels) => setForm((old) => ({ ...old, labels }))}
        required
        values={form.labels}
      />
      <TextsField
        onChange={(texts) => setForm((old) => ({ ...old, texts }))}
        values={form.texts}
      />
      <Field
        help={intl.formatMessage({
          description: "Coordinates input help",
          defaultMessage:
            "Enter a valid pair of coordinates in decimal degrees between *±90* for latitude and *±180* for longitude. Example: Latitude *48.400002*, Longitude *9.983333* ",
        })}
        label={intl.formatMessage({
          description: "Coordinates field label",
          defaultMessage: "Coordinates",
        })}
      >
        <div className="flex flex-col md:flex-row w-full">
          <Input
            label={intl.formatMessage({
              description: "Latitude input label",
              defaultMessage: "Latitude",
            })}
            onChange={(e) =>
              setForm((old) => ({ ...old, latitude: e.target.value }))
            }
            placeholder={intl.formatMessage({
              description: "Latitude placeholder",
              defaultMessage: "Enter a decimal latitude",
            })}
            value={form.latitude || ""}
          />
          <Input
            className="mt-4 md:mt-0 md:ml-4"
            label={intl.formatMessage({
              description: "Longitude input label",
              defaultMessage: "Longitude",
            })}
            onChange={(e) =>
              setForm((old) => ({ ...old, longitude: e.target.value }))
            }
            placeholder={intl.formatMessage({
              description: "Longitude placeholder",
              defaultMessage: "Enter a decimal longitude",
            })}
            value={form.longitude || ""}
          />
        </div>
      </Field>
      <SameAsField
        onChange={(sameAs) => setForm((old) => ({ ...old, sameAs }))}
        values={form.sameAs}
      />
      <CommentsField
        onChange={(comments) => setForm((old) => ({ ...old, comments }))}
        values={form.comments}
      />
      <EditorControls
        cancelUrl={baseUrl + (place?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            comments: serializeLiteral(form.comments),
            labels: serializeLiteral(form.labels),
            latitude: form.latitude?.replace(",", "."),
            longitude: form.longitude?.replace(",", "."),
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
  const intl = useIntl();
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
      <FormIntroduction>
        {intl.formatMessage({
          description: "Place form introduction",
          defaultMessage:
            "Please use the following form to enter the appropriate data for the desired place.",
        })}
      </FormIntroduction>
      <Editor place={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
