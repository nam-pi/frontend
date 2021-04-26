import { PartialNavigation } from "App/types";
import { Button } from "../Button";

export const ItemNav = ({ nav }: { nav: PartialNavigation }) => (
  <div className="space-x-2">
    <Button disabled={!nav.first} onClick={nav.first}>
      first
    </Button>
    <Button disabled={!nav.previous} onClick={nav.previous}>
      previous
    </Button>
    <Button disabled={!nav.next} onClick={nav.next}>
      next
    </Button>
    <Button disabled={!nav.last} onClick={nav.last}>
      last
    </Button>
  </div>
);
