import { faMapMarker, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { DivIcon } from "leaflet";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Marker as LeafletMarker, MarkerProps, Popup } from "react-leaflet";
import styles from "./styles.module.css";

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
            style={{ filter: "drop-shadow(1px 0px 4px #696969)" }}
            icon={icon}
          />
        ),
        className: "text-3xl flex items-center justify-center",
        iconSize: [0, 0],
      })
    }
    {...markerProps}
  >
    {popup && (
      <Popup className={clsx(styles.popup, "mb-14 rounded-md bg-white")}>
        {popup}
      </Popup>
    )}
  </LeafletMarker>
);
