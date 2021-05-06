import { TranslationProvider } from "I18n/TranslationContext";
import { NampiProvider } from "nampi-use-api";
import React from "react";
import ReactDOM from "react-dom";
import "tailwindcss/tailwind.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

const api = process.env.REACT_APP_API;
const auth = process.env.REACT_APP_AUTH;
const client = process.env.REACT_APP_CLIENT;
const realm = process.env.REACT_APP_REALM;

if (!api || !auth || !client || !realm) {
  throw new Error("Invalid environment");
}

ReactDOM.render(
  <React.StrictMode>
    <TranslationProvider>
      <NampiProvider
        api={api}
        auth={auth}
        client={client}
        realm={realm}
        searchTimeout={200}
        silentSsoUri={window.location.origin + "/silent-check-sso.html"}
        sso={true}
      >
        <App />
      </NampiProvider>
    </TranslationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
