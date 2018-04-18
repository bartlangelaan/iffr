import { stringify } from 'querystring';

const BASE_URL = 'https://tt.iffr.com';

class TicketTriggerLogin {
  /**
   * This function returns the page the user should be redirected to if they
   * need to be authenticated. The successUrl is the url where the user is
   * redirected to after authentication is done. On that page, the
   * generatePageToGetToken function should be returned.
   */
  getRedirectUrl(successUrl: string) {
    return `${BASE_URL}/nl/account/login?${stringify({
      success_url: successUrl,
    })}`;
  }

  /**
   * Unfortunately, TicketTrigger doesn't support something like oauth. We
   * don't get the token directly, but we can fetch it on the client with AJAX.
   *
   * Here we return an HTML page, which will get the token and send it to a
   * provided url. The fetch API isn't supported in all browsers, so we need
   * to add some polyfills. Also, we need to use ES3.
   *
   * The user is then redirected to the redirectUrl, with a query parameter
   * 'user_uuid' attached. If somehow it fails to get the user uuid, the
   * 'error' parameter is attached instead.
   */
  generatePageToGetUserUuid(redirectUrl: string): string {
    // Check if we need an ? or & for the query to append.
    const q = redirectUrl.includes('?') ? '&' : '?';

    return `
    <html><head>
      <title>Redirecting...</title>
      <script src="https://cdn.polyfill.io/v2/polyfill.js?features=fetch"></script>
      <script>
        fetch('${BASE_URL}/api/v2/status.json', {credentials: 'include'}).then(function(response) {
          return response.json();
        }).then(function(response) {
          var user_uuid = encodeURIComponent(response.client.id);
          document.location = '${redirectUrl + q}user_uuid=' + user_uuid;
        })
        .catch(function(error) {
          var message = encodeURIComponent(error.message);
          document.location = '${redirectUrl + q}error=' + message;
        });
      </script>
    </head></html>
    `;
  }
}

export default new TicketTriggerLogin();
