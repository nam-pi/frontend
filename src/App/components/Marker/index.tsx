import { faMapMarker, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { DivIcon } from "leaflet";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Marker as LeafletMarker, MarkerProps, Popup } from "react-leaflet";

export interface Props extends Omit<MarkerProps, "icon" | "children"> {
  icon?: IconDefinition;
  className?: string;
  popup?: ReactNode;
}

export const Marker = ({
  className,
  icon = faMapMarker,
  popup,
  ...markerProps
}: Props) => (
  <LeafletMarker
    icon={
      new DivIcon({
        html: renderToString(
          <FontAwesomeIcon
            className={clsx(className, "transform -translate-y-1/2")}
            style={{ filter: "drop-shadow(1px 0px 3px #282828)" }}
            icon={icon}
          />
        ),
        className: "flex items-center justify-center",
        iconSize: [0, 0],
      })
    }
    {...markerProps}
  >
    {popup && <Popup>{popup}</Popup>}
  </LeafletMarker>
);
