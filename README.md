# NAMPI Frontend

The Frontend for the project _Nuns and Monks - Prosopographical Interfaces_.

## Environment parameters

| Parameter                        | Mandatory | Default | Example                                           | Description                                                                                                                                                                                                                                               |
| -------------------------------- | --------- | ------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_API`                  | \*        |         | `http://example.com/api`                          | The URL of the NAMPI API entrypoint                                                                                                                                                                                                                       |
| `REACT_APP_AUTH`                 | \*        |         | `http://example.com/keycloak/auth`                | The URL of of the Keycloak auth endpoint                                                                                                                                                                                                                  |
| `REACT_APP_CLIENT`               | \*        |         | `my-website`                                      | The Keycloak client ID                                                                                                                                                                                                                                    |
| `REACT_APP_HOME_TEXTS`           | \*        |         | `{"en-GB": "# Home\n\nWelcome to my *database*"}` | The content for the home page in Markdown wrapped in JSON with newlines replaced by instances of `\n`. Only an entry in English (UK) is mandatory as it is the default language of the app. Future versions of the app might support additional languages |
| `REACT_APP_LOG_MISSING_MESSAGES` |           | `false` | `true                                             | Whether or not output a warning in the browser console for missing i18n messages                                                                                                                                                                          |
| `REACT_APP_NAME`                 | \*        |         | `My database`                                     | The app name to be used in various places of the UI                                                                                                                                                                                                       |
| `REACT_APP_REALM`                | \*        |         | `my-realm`                                        | The Keycloak realm name                                                                                                                                                                                                                                   |

## I18n

This app uses [React-Intl](https://formatjs.io/docs/react-intl) to manage translation strings inside the TypeScript code. The translation strings can be extracted into a JSON file using the following command:

`npx @formatjs/cli extract "src/**/*.{ts,tsx,js,jsx}" --out-file translations/en-GB.json --ignore src/**/*.d.ts --id-interpolation-pattern '[sha512:contenthash:base64:6]'`

This creates a file `translations/en-GB.json` containing the default messages from the source code. Due to the fact that the default language of the website is British English this file can be used for this language as well as the basis for translations in other languages. To create these translations, the base JSON can be loaded in translation software like [BabelEdit](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-intl). To actually use these translations, they have to be compiled back in a format that React-Intl understands. This can be done with either

`npx @formatjs/cli compile translations/en-GB.json --out-file src/I18n/translations/en-GB.json`
`npx @formatjs/cli compile --ast translations/en-GB.json --out-file src/I18n/translations/en-GB.json`

The translation files in the `src/I18n/translations folder can then be directly imported into the message provider. The second version of the compile command compiles the messages into the `AST` format that is [faster](https://formatjs.io/docs/getting-started/message-distribution#compiling-messages) because it doesn't have to be parsed by React-Intl.

_Note: The drawback is that there are no fallback messages for AST-format files, therefore the translation needs to be complete, otherwise empty areas will appear on the website where messages are missing._
