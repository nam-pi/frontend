import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Button } from "../Button";

interface Props {
  active: boolean;
  children: ReactNode;
  closeCallback: VoidFunction;
  okButtonText?: string;
  rightElement?: ReactNode;
  title: string;
}

export const Modal = ({
  active,
  children,
  closeCallback,
  okButtonText,
  rightElement,
  title,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Transition appear show={active} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeCallback}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white shadow-lg rounded-lg border-2">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-6"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">{children}</div>

                <div className="mt-4 flex justify-between">
                  <Button onClick={closeCallback}>
                    {okButtonText ||
                      formatMessage({
                        description: "Default modal close button label",
                        defaultMessage: "Close",
                      })}
                  </Button>
                  {rightElement || <></>}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
