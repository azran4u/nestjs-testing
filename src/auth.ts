import { google } from 'googleapis';
import express from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import { isNil } from 'lodash';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID =
  '289834743365-tgscc5epbteiu94h7l2tjv3kofj3c94v.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_PROJECT_ID = 'cosmic-region-361705';
const SCOPES = [
  'openid',
  'profile',
  'https://www.googleapis.com/auth/contacts',
];
const AUTH0_DOMAIN = 'ultrabyte-tests.us.auth0.com';
const AUTH0_MGMT_API_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdZQVVxczJFQXJwZTA2V0tPUDQtMSJ9.eyJpc3MiOiJodHRwczovL3VsdHJhYnl0ZS10ZXN0cy51cy5hdXRoMC5jb20vIiwic3ViIjoiNHlaVHpnSTRIdDlFeEQ0RWU3YXc5eFNkM1ZoWXoxNWxAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vdWx0cmFieXRlLXRlc3RzLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjYzODYxMjk5LCJleHAiOjE2NjM5NDc2OTksImF6cCI6IjR5WlR6Z0k0SHQ5RXhENEVlN2F3OXhTZDNWaFl6MTVsIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnNfc3VtbWFyeSBjcmVhdGU6YWN0aW9uc19sb2dfc2Vzc2lvbnMgcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.b5PCqEfreJCbxJSk0LL-RDTcLzkRzjEi9nZ4Ur-s4x-4-kJlKCV0fM__SaxB4vbPMwAjZZS659gpTMi62TFaOJlIFLeQVHx2s12q60AR0_bt6f1qTjiOZOMwZtKzT91Fv0fbmnMd_TZr1AlRZ1RmX40r7d0uNkv5_V-g7WFssP4P3VkKp16YmN7N4M8_ftGtmNKJi_Yjh3L-se9TTM38rHGqSt50Kj1eSCxNpo4r5CVKDlf1e2FXyCB2YFbcuVm6CXwjzbYGCe031ns2BUGIPfV1zZAnCCS6kYv_gq4tPn0jQoWPOj1Boj-bypThkBDqOCFcOixRFFt7WQ7tjMhGyQ';
const AUTH0_CLIENT_ID = '4yZTzgI4Ht9ExD4Ee7aw9xSd3VhYz15l';
const AUTH0_CLIENT_SECRET =
  '1iztZEnYWF2ewURM6iWbie5RvfZoVBNbJfB3rcX5Rn_BtnV18ldKg-lf-KtZO6wJ';
const AUTH0_CALLBACK_URI =
  'https://ultrabyte-tests.us.auth0.com/login/callback';

function server() {
  const app = express();
  const port = 9876;

  app.use(express.json());
  app.use(cors());

  // define a route handler for the default home page
  app.get('/health', (req, res) => {
    // render the index template
    res.status(200).send('ok');
  });

  app.post('/contacts', async (req, res) => {
    console.log(`/contacts ${JSON.stringify(req?.body, null, 4)}`);
    const { email, userId } = req.body;
    await contactsHandler(email, userId);
    res.status(200).send();
  });

  // start the express server
  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
  });
}

export async function start() {
  server();
}

async function contactsHandler(email: string, userId: string) {
  console.log(`email = ${email} userId = ${userId}`);
  if (isNil(email) || isNil(userId)) return;
  const auth0MgmtToken = await getAuth0MgmtApiToken();
  const googleAccessToken = await getGoogleAccessTokenFromAuth0MgmmtApi(
    auth0MgmtToken,
    userId
  );
  console.log(`googleAccessToken: ${googleAccessToken}`);
  const contacts = await getContactsFromGoogle(googleAccessToken);
  console.log(`contacts: ${contacts}`);
  return contacts;
}

// async function saveCredentials(client) {
//   const content = await readFile(CREDENTIALS_PATH);
//   // @ts-ignore
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

async function getAuth0MgmtApiToken() {
  let axiosResponse: AxiosResponse;

  const url = `https://${AUTH0_DOMAIN}/oauth/token`;
  const axiosInstance = axios.create({
    timeout: 5000,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
  });

  try {
    axiosResponse = await axiosInstance.post(url, data);
    console.log(
      `getAuth0MgmtApiToken axiosResponse = ${JSON.stringify(
        axiosResponse.data,
        null,
        4
      )}`
    );
    const token = axiosResponse?.data?.access_token;
    console.log(`getAuth0MgmtApiToken token = ${token}`);
    if (isNil(token)) {
      console.log(`getAuth0MgmtApiToken token is null`);
      return;
    }
    return token;
  } catch (error) {
    console.log(`getAuth0MgmtApiToken error = ${error}`);
  }
}

async function getGoogleAccessTokenFromAuth0MgmmtApi(token, userId: string) {
  let axiosResponse: AxiosResponse;

  const url = `https://${AUTH0_DOMAIN}/api/v2/users/${userId}`;
  const axiosInstance = axios.create({
    timeout: 5000,
    headers: { authorization: `Bearer ${token}` },
  });

  try {
    axiosResponse = await axiosInstance.get(url);
    console.log(
      `getGoogleAccessTokenFromAuth0MgmmtApi axiosResponse = ${JSON.stringify(
        axiosResponse.data,
        null,
        4
      )}`
    );
    const token = axiosResponse?.data?.identities[0]?.access_token;
    console.log(`getGoogleAccessTokenFromAuth0MgmmtApi token = ${token}`);
    if (isNil(token)) {
      console.log(`getGoogleAccessTokenFromAuth0MgmmtApi token is null`);
      return;
    }
    return token;
  } catch (error) {
    console.log(`getGoogleAccessTokenFromAuth0MgmmtApi error = ${error}`);
  }
}

async function getContactsFromGoogle(token: string) {
  //   const auth = google.auth.fromJSON({
  //     client_id: GOOGLE_CLIENT_ID,
  //     client_secret: GOOGLE_CLIENT_SECRET,
  //     project_id: GOOGLE_PROJECT_ID,
  //     type: 'authorized_user',
  //   });

  try {
    const oAuth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      AUTH0_CALLBACK_URI
    );

    console.log(`getContactsFromGoogle new oAuth2Client`);
    // const r = await oAuth2Client.getToken(token);
    // console.log(`getContactsFromGoogle r=${JSON.stringify(r)}`);
    // Make sure to set the credentials on the OAuth2 client.

    const tokenInfo = oAuth2Client.setCredentials({ access_token: token });
    const auth = oAuth2Client;

    console.log(`getContactsFromGoogle oAuth2Client`);
    const service = google.people({ version: 'v1', auth });
    let res = await service.people.connections.list({
      resourceName: 'people/me',
      pageSize: 100,
      personFields: 'names,emailAddresses,phoneNumbers,nicknames',
    });
    console.log(
      `getContactsFromGoogle connections list ${res.data?.connections?.length}`
    );
    res = await service.people.connections.list({
      oauth_token: token,
      resourceName: 'people/me',
      pageSize: 100,
      personFields: 'names,emailAddresses,phoneNumbers,nicknames',
      pageToken: res?.data?.nextPageToken,
    });
    console.log(
      `getContactsFromGoogle page ${res?.data?.nextPageToken} connections list ${res.data?.connections?.length}`
    );
    const connections = res.data.connections;
    // console.log(
    //   `getContactsFromGoogle connections ${JSON.stringify(connections)}`
    // );
    if (!connections || connections.length === 0) {
      console.log(`getContactsFromGoogle No connections found.`);

      return;
    }
    // connections.forEach((person) => {
    //   if (person.names && person.names.length > 0) {
    //     console.log(
    //       `getContactsFromGoogle display name = ${person.names[0].displayName}`
    //     );
    //   } else {
    //     console.log(
    //       `getContactsFromGoogle No display name found for connection.`
    //     );
    //   }
    // });
  } catch (error) {
    console.log(`getContactsFromGoogle error = ${error}`);
  }
}
