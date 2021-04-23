# NAMPI Frontend

The Frontend for the project _Nuns and Monks - Prosopographical Interfaces_.

## Environment parameters

| Parameter                      | Mandatory | Default         | Example                            | Description                              |
| ------------------------------ | --------- | --------------- | ---------------------------------- | ---------------------------------------- |
| `REACT_APP_API_ENTRYPOINT`     | \*        |                 | `http://example.com/api`           | The URL of the NAMPI API entrypoint      |
| `REACT_APP_KEYCLOAK_AUTH_URL`  | \*        |                 | `http://example.com/keycloak/auth` | The URL of of the Keycloak auth endpoint |
| `REACT_APP_KEYCLOAK_REALM`     |           | `nampi`         |                                    | The Keycloak realm name                  |
| `REACT_APP_KEYCLOAK_CLIENT_ID` |           | `nampi-website` |                                    | The Keycloak client ID                   |

## I18n

This app uses [React-Intl](https://formatjs.io/docs/react-intl) to manage translation strings inside the TypeScript code. The translation strings can be extracted into a JSON file using the following command:

`npx @formatjs/cli extract "src/**/*.{ts,tsx,js,jsx}" --out-file en-US.json --ignore src/**/*.d.ts --id-interpolation-pattern '[sha512:contenthash:base64:6]'`

This creates a file `en-US.json` in the root directory. This file serves two purposes:

- It can be used as the (American-)English translation.
- It can be used as the basis for other-language translations in programs like [BabelEdit](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-intl). The resulting `[translations].json` files need to be copied to `src/I18n/translations/` and added to `/src/I18n/constants.ts` in the `MESSAGES` constant.

In case messages are missing for the currently selected language the message from the TypeScript code is used.
