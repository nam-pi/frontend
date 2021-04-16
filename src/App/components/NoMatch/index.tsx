import { Link } from "react-router-dom";

export const NoMatch = () => (
  <div>
    <h1>Error</h1>
    <p>
      Page not found, go back to <Link to="/">Home</Link>
    </p>
  </div>
);
