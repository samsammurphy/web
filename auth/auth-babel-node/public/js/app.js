// global auth variable
let auth0 = null;

const configureClient = async () => {
    const response = await fetch("/auth_config.json");
    const config = await response.json();
  
    // initialize the auth variable
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId,
      audience: config.audience
    });
    /* This call ^ will also populate the in-memory cache 
    with a valid access token and user profile information 
    if someone has already authenticated before and that 
    session is still valid.
    */

  };


window.onload = async () => {
    await configureClient();

    // First thing is make sure the User Interface 
    // represents current authentication state
    updateUI();

    const isAuthenticated = await auth0.isAuthenticated();
    console.log('isAuthenticated',isAuthenticated)
    
    // get the querystring part of the URL
    const query = window.location.search;

    /* If the URL query contains a 'code' and 'state' parameter then
    an authentication result is present, auth0.handleRedirectCallback() 
    will attempt to exchange the result for real tokens.
    */
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();
        
        updateUI();
    
        // Remove the query string parameters from the URL
        window.history.replaceState({}, document.title, "/");
      }
};

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
  
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
    document.getElementById("btn-call-api").disabled = !isAuthenticated;

    // show the gated content
    if (isAuthenticated) {
        
        // The classList property is useful to add, remove and toggle CSS classes on an element
        document.getElementById("gated-content").classList.remove("hidden");

        access_token = await auth0.getTokenSilently()
        user = await auth0.getUser()
    
        document.getElementById("ipt-access-token").innerHTML = access_token
        document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(user);
    
      } else {
        document.getElementById("gated-content").classList.add("hidden");
      }
  };

const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
};

const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };

  const callApi = async () => {
    try {
  
      // Get the access token from the Auth0 client
      const token = await auth0.getTokenSilently();

      // Make the call to the API, setting the token
      // in the Authorization header
      const response = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Fetch the JSON result
      const responseData = await response.json();
  
      // Display the result in the output element
      const responseElement = document.getElementById("api-call-result");
  
      responseElement.innerText = JSON.stringify(responseData, {}, 2);
  
  } catch (e) {
      // Display errors in the console
      console.error(e);
    }
  };