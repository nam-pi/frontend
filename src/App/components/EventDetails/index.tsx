import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCompletePlace } from "App/hooks/useCompletePlaces";
import { useEventDate } from "App/hooks/useEventDate";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { LatLngTuple } from "leaflet";
import { Event, SourceLocation, useEvent, useUser } from "nampi-use-api";
import { ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DetailEditControls } from "../DetailEditControls";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemLink } from "../ItemLink";
import { ItemTexts } from "../ItemTexts";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Map } from "../Map";
import { Marker } from "../Marker";
import { PlaceholderText } from "../PlaceholderText";

interface Props {
  idLocal: string;
}

const getOtherParticipants = (data: undefined | Event): Event["participants"] =>
  data?.participants.filter((p) => p.id !== data?.mainParticipant.id) || [];

const getLocation = (location: undefined | SourceLocation): ReactNode => {
  const text = location?.text;
  return text?.startsWith("http") ? (
    <a href={text} className="hover:opacity-80 inline-flex items-center">
      <FormattedMessage
        description="Source link description"
        defaultMessage="'<Go to location'>"
      />
      <FontAwesomeIcon className="text-blue-500 text-xs ml-1" icon={faGlobe} />
    </a>
  ) : (
    text
  );
};

export const EventDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const getDate = useEventDate();
  const { data, loading } = useEvent({ idLocal });
  const date = getDate(data, "full");
  const user = useUser();
  const isAuthor = useMemo(
    () =>
      data?.act.authors.find((a) => a.id === user.data?.author?.id) !==
      undefined,
    [data?.act.authors, user.data?.author?.id]
  );
  const { formatDate, formatList } = useIntl();
  const otherParticipants = getOtherParticipants(data);
  const [place] = useCompletePlace(data?.place);
  const coordinates: undefined | LatLngTuple =
    place?.latitude && place?.longitude
      ? [place.latitude, place.longitude]
      : undefined;
  return data && !loading ? (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="space-y-4 flex-grow w-full md:w-auto">
          <div className="flex items-center">
            <Heading>
              <FormattedMessage
                description="Event heading"
                defaultMessage="Event: {label}"
                values={{ label: getText(data.labels) }}
              />
            </Heading>
            {isAuthor && (
              <DetailEditControls
                type="events"
                idLocal={idLocal}
                labels={data.labels}
              />
            )}
          </div>
          <ItemInheritance item={data} />
          <ItemLabels item={data} />
          <ItemTexts item={data} />
          <Heading level={2}>
            <FormattedMessage
              description="Document interpretation act heading"
              defaultMessage="Document interpretation act"
              values={{ label: getText(data.labels) }}
            />
          </Heading>
          <ul>
            <li>
              <FormattedMessage
                description="Author text"
                defaultMessage="Interpretation {authorCount, plural, one {author} other {authors}}: {authors}"
                values={{
                  authorCount: data.act.authors.length,
                  authors: formatList(
                    data.act.authors.map((a) => (
                      <ItemLink key={a.id} item={a} />
                    )),
                    { type: "conjunction" }
                  ),
                }}
              />
            </li>
            <li>
              <FormattedMessage
                description="Authoring date text"
                defaultMessage="Authoring date: {date}"
                values={{
                  date: formatDate(data.act.date, { dateStyle: "long" }),
                }}
              />
            </li>
            <li>
              {data.act.sourceLocation.text ? (
                <FormattedMessage
                  description="Source text"
                  defaultMessage="Source: {source}, {location}"
                  values={{
                    source: <ItemLink item={data.act.sourceLocation.source} />,
                    location: getLocation(data.act.sourceLocation),
                  }}
                />
              ) : (
                <FormattedMessage
                  description="Source text"
                  defaultMessage="Source: {source}"
                  values={{
                    source: <ItemLink item={data.act.sourceLocation.source} />,
                  }}
                />
              )}
            </li>
          </ul>
          <Heading level={2}>
            <FormattedMessage
              description="Event details heading"
              defaultMessage="Event details"
              values={{ label: getText(data.labels) }}
            />
          </Heading>
          <ul>
            <li>
              <FormattedMessage
                description="Event date text"
                defaultMessage="Event date: {date}"
                values={{
                  date: date || (
                    <PlaceholderText>
                      <FormattedMessage
                        description="Unknown date text"
                        defaultMessage="unknown"
                      />
                    </PlaceholderText>
                  ),
                }}
              />
            </li>
            <li>
              <FormattedMessage
                description="Event place link text"
                defaultMessage="Event location: {place}"
                values={{
                  place: data.place ? (
                    <ItemLink item={data.place} />
                  ) : (
                    <PlaceholderText>
                      <FormattedMessage
                        description="unknown event place placeholder text"
                        defaultMessage="Unknown"
                      />
                    </PlaceholderText>
                  ),
                }}
              />
            </li>
            <li>
              <FormattedMessage
                description="Main person link text"
                defaultMessage="Main person: {person}"
                values={{
                  person: <ItemLink item={data.mainParticipant} />,
                }}
              />
            </li>
            {otherParticipants.length > 0 && (
              <li>
                <FormattedMessage
                  description="Other participants text"
                  defaultMessage="Also participating: {participants}"
                  values={{
                    participants: formatList(
                      otherParticipants.map((p) => (
                        <ItemLink key={p.id} item={p} />
                      )),
                      { type: "conjunction" }
                    ),
                  }}
                />
              </li>
            )}
            <li>
              <FormattedMessage
                description="Used aspects text"
                defaultMessage="Aspects used in the event: {aspects}"
                values={{
                  aspects: data.aspects ? (
                    formatList(
                      data.aspects.map((a) => <ItemLink key={a.id} item={a} />),
                      { type: "conjunction" }
                    )
                  ) : (
                    <PlaceholderText>
                      <FormattedMessage
                        description="No aspects placeholder text"
                        defaultMessage="None"
                      />
                    </PlaceholderText>
                  ),
                }}
              />
            </li>
          </ul>
          <ItemComments item={data} />
        </div>
        {coordinates && (
          <Map className="w-full md:min-w-64 md:w-64 h-64" center={coordinates}>
            <Marker
              className="text-green-500"
              position={coordinates}
              popup={place && <ItemLink item={place} />}
            />
          </Map>
        )}
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
