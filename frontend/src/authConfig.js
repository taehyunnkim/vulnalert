// Documentation: https://learn.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-react
export const msalConfig = {
    auth: {
        clientId:  "c1ee541a-68a4-4abf-9494-270544b5d668",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: "http://localhost:7777/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    }
};
  
export const loginRequest = {   
    scopes: ["User.Read", "openid", "profile"]
};

export const graphRequest = {
    scopes: ["openid", "profile"],
};