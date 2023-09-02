import { createUserManager } from "redux-oidc";
/*const  config = {
    //userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    //authority: "http://ec2-13-127-15-18.ap-south-1.compute.amazonaws.com",
    authority: `https://${host}:5001`,
    client_id: "js",
    redirect_uri: `https://${host}:3000/callback`,
    post_logout_redirect_uri: `https://${host}:3000`,
    response_type: "code",
    // eslint-disable-next-line no-multi-str
    scope: "openid profile 3gpp:IWF:Tetra \
    3gpp:mcptt:ptt_server\
    3gpp:mcptt:key_management_server\
    3gpp:mcptt:config_management_server\
    3gpp:mcptt:group_management_server\
    3gpp:mcdata:ptt_server\
    3gpp:mcdata:key_management_server\
    3gpp:mcdata:config_management_server\
    3gpp:mcdata:group_management_server\
    3gpp:mcvideo:ptt_server\
    3gpp:mcvideo:key_management_server\
    3gpp:mcvideo:config_management_server\
    3gpp:mcvideo:group_management_server"
};*/
//`https://192.168.1.90:5001` authority
//https://192.168.1.50:3000 post_logout_redirect_uri

// const config = {
//     authority: `https://${global.config.ipConfig.idmsHost}:${global.config.ipConfig.idmsPort}`,
//     client_id: "js",
//     redirect_uri: `https://${global.config.ipConfig.host}:${global.config.ipConfig.cmcPort}/callback`,
//     post_logout_redirect_uri: `https://${global.config.ipConfig.host}:${global.config.ipConfig.cmcPort}`,
//     response_type: "code",
//     scope: "openid profile",
// }

const config = {
    authority: `http://172.23.19.105:8080/idms/`,
    client_id: "urn:uuid:11112222-3333-4444-8888-555566667777",
    redirect_uri: `http://172.23.57.2:3000/callback`,
    post_logout_redirect_uri: `https://${global.config.ipConfig.host}:${global.config.ipConfig.cmcPort}`,
    response_type: "code",
    scope: "openid profile",
}

const userManager = createUserManager(config);

export default userManager;
