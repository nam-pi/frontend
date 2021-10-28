import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Entity } from "nampi-use-api";
import { Link } from "react-router-dom";
import { DeleteButton } from "../DeleteButton";

interface Props {
  type: "aspects" | "events" | "groups" | "persons" | "places" | "sources";
  idLocal: string;
  labels: Entity["labels"];
}

export const DetailEditControls = ({ idLocal, labels, type }: Props) => (
  <>
    <Link
      className="ml-4 text-gray-400 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
      to={`/${type}/${idLocal}?edit`}
    >
      <FontAwesomeIcon icon={faEdit} />
    </Link>
    <DeleteButton entityLabels={labels} idLocal={idLocal} type={type} />
  </>
);
