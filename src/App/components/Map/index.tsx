import clsx from "clsx";
import {
    MapContainer,
    MapContainerProps,
    TileLayer,
    useMap
} from "react-leaflet";
import styles from "./styles.module.css";

interface Props extends MapContainerProps {}

const ChangeView = ({
  bounds,
  center,
  zoom,
}: Pick<Props, "bounds" | "center" | "zoom">) => {
  const map = useMap();
  if (bounds) {
    map.setMaxBounds(bounds);
  } else {
    map.setView(center || map.getCenter(), zoom || map.getZoom());
  }
  return null;
};

export const Map = ({
  center,
  children,
  className,
  zoom = 13,
  ...mapProps
}: Props) => {
  return (
    <MapContainer
      {...mapProps}
      center={center}
      zoom={zoom}
      className={clsx(className, styles.leaflet, "rounded-lg", "border-2")}
    >
      {center && <ChangeView center={center || [0, 0]} zoom={zoom} />}
      <TileLayer
        className="z-0"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};
