// Documentation: https://learn.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-react

export const msalConfig = {
    auth: {
        clientId:  "c4f5ff38-ce2d-43ba-93d3-80e93db284b2",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: "http://localhost:3000/redirect",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};
  
export const loginRequest = {   
    scopes: ["User.Read"]
};