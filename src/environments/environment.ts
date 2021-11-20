// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  build_type: 'local_test',
  oauthIssuer: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_1Nc1U9zKv",
  oauthRedirectUri: window.location.origin,
  oauthClientId: '3lmlqb5mlp21etl4n20lj37j39',
  oauthShowDebugInformation: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
