import { PartialNavigation } from "App/types";

export const ItemNav = ({ nav }: { nav: PartialNavigation }) => (
  <>
    <button disabled={!nav.first} onClick={nav.first}>
      first
    </button>
    <button disabled={!nav.previous} onClick={nav.previous}>
      previous
    </button>
    <button disabled={!nav.next} onClick={nav.next}>
      next
    </button>
    <button disabled={!nav.last} onClick={nav.last}>
      last
    </button>
  </>
);
