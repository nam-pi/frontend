import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { Button } from "../Button";

interface Props {
  cancelUrl: string;
  loading: boolean;
  mutate: VoidFunction;
  valid: boolean;
}

export const EditorControls = ({
  cancelUrl,
  loading,
  mutate,
  valid,
}: Props) => {
  const history = useHistory();
  return (
    <div className="flex justify-start mt-4">
      <Button disabled={loading || !valid} onClick={() => mutate()}>
        {loading ? (
          <FontAwesomeIcon icon={faCircleNotch} spin />
        ) : (
          <FormattedMessage
            description="Submit button label"
            defaultMessage="Submit"
          />
        )}
      </Button>
      <Button className="ml-4" onClick={() => history.push(cancelUrl)}>
        <FormattedMessage
          description="Cancel button label"
          defaultMessage="Cancel"
        />
      </Button>
    </div>
  );
};
