import { faCircleNotch, faEraser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import {
    LiteralString,
    useAspectDelete,
    useEventDelete,
    useGroupDelete,
    usePersonDelete,
    usePlaceDelete,
    useSourceDelete
} from "nampi-use-api";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Paragraph } from "../Paragraph";

interface Props {
  entityLabels: undefined | LiteralString[];
  idLocal: string;
  type: "aspects" | "events" | "groups" | "persons" | "places" | "sources";
}

const useRemove = (type: Props["type"], idLocal: Props["idLocal"]) => {
  const aspect = useAspectDelete(idLocal);
  const event = useEventDelete(idLocal);
  const group = useGroupDelete(idLocal);
  const person = usePersonDelete(idLocal);
  const place = usePlaceDelete(idLocal);
  const source = useSourceDelete(idLocal);
  switch (type) {
    case "aspects":
      return aspect;
    case "events":
      return event;
    case "groups":
      return group;
    case "persons":
      return person;
    case "places":
      return place;
    case "sources":
      return source;
  }
};

export const DeleteButton = ({ entityLabels, idLocal, type }: Props) => {
  const literal = useLocaleLiteral();
  const [remove, state] = useRemove(type, idLocal);
  const [modal, setModal] = useState<boolean>(false);
  const openModal = useCallback(() => setModal(true), []);
  const closeModal = useCallback(() => setModal(false), []);
  useEffect(() => {
    if (!state.loading && state.data) {
      window.location.assign(`/${type}`);
    }
  }, [state.data, state.loading, type]);
  return (
    <>
      <button className="ml-4 text-gray-400" onClick={openModal}>
        <FontAwesomeIcon icon={faEraser} />
      </button>
      <Modal
        active={modal}
        closeCallback={closeModal}
        okButtonText={
          state.error ? (
            <FormattedMessage
              description="Close button label"
              defaultMessage="Close"
            />
          ) : (
            <FormattedMessage
              description="Cancel button label"
              defaultMessage="Cancel"
            />
          )
        }
        rightElement={
          state.error === undefined && (
            <Button
              className="mr-4 text-red-500 border-red-300"
              onClick={remove}
            >
              {state.loading ? (
                <FontAwesomeIcon icon={faCircleNotch} spin />
              ) : (
                <FormattedMessage
                  description="Ok button label"
                  defaultMessage="Delete"
                />
              )}
            </Button>
          )
        }
        title={
          <FormattedMessage
            description="Entity delete heading"
            defaultMessage="Delete entity"
          />
        }
      >
        {state.error ? (
          <Paragraph className="text-red-500">
            <FormattedMessage
              description="Error label"
              defaultMessage="Error"
            />
            :&nbsp;{literal(state.error.description)}
          </Paragraph>
        ) : (
          <Paragraph className="text-gray-600">
            <FormattedMessage
              description="Delete entity description"
              defaultMessage="You are about to delete the entity ''{entity}''. This process is irreversible. Do you want to proceed?"
              values={{
                entity: (
                  <span className="font-semibold">{literal(entityLabels)}</span>
                ),
              }}
            />
          </Paragraph>
        )}
      </Modal>
    </>
  );
};
