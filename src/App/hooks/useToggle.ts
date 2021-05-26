import { useState } from "react";

export const useToggle = (initialValue: boolean = false): [on: boolean, toggle: VoidFunction] => {
  const [on, setOn] = useState(initialValue);
  return [on, () => setOn(current => !current)]
}