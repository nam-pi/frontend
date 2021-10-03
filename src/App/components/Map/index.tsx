import clsx from "clsx";
import {
    MapContainer,
    MapContainerProps,
    TileLayer,
    useMap
} from "react-leaflet";
import styles from "./styles.module.css";

interface Props extends MapContainerProps {}

const ChangeView = ({ center, zoom }: Pick<Props, "center" | "zoom">) => {
  const map = useMap();
  map.setView(center || map.getCenter(), zoom || map.getZoom());
  return null;
};

export const Map = ({ children, className, ...mapProps }: Props) => (
  <MapContainer
    {...mapProps}
    className={clsx(className, styles.leaflet, "rounded-lg", "border-2")}
  >
    <ChangeView center={mapProps.center} zoom={mapProps.zoom} />
    <TileLayer
      className="z-0"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {children}
  </MapContainer>
);
