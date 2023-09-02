import { pbxDomainConfig } from "../constants/constants";
const axios = require("axios").default;
const MCXClient = require('../MCXclient/MCXClient').MCXClient;
const WebSocketInterface = require('../MCXclient/jssip/WebSocketInterface');

export class MCXClientConfig {

    config = (host, socket, domains, resp) => {
        //const uniqStr = this.generateString(5);
        const uniqStr = Math.random().toString(36).substring(2,7);
        const num = Math.floor(Math.random() * (999 - 100 + 1) + 100) // need to check
        const IMPU = `mcx.cons-${num}${uniqStr}`
        const IMPI = `00101010${num}0690`
        //const IMPU = 'mcx.cons-111.neme_IMS'
        //const IMPI = '001010101110690_IMS'
        //sip:mcx.cons-320.cons@consort.org

        // const asPSI = `mcptt-as-cons-1.ims.mnc001.mcc001.3gppnetwork.org` // it should be dratchio server endpoint.
        // const domain = `ims.mnc001.mcc001.3gppnetwork.org`
        // const realm = `ims.mnc001.mcc001.3gppnetwork.org`

        const asPSI = `mcptt-as-cons-1.consort.org` // it should be dratchio server endpoint.
        const domain = `consort.org`
        const realm = `consort.org`
        let register_expires = resp && resp.register_expires ? resp.register_expires : '15';
        console.log('register_expires..', resp, register_expires);
        let totalPreEstSessionCount = resp && resp.totalPreEstSessionCount ? resp.totalPreEstSessionCount : 0;
        let privatePreEstCallsAllowed = true;
        let preEstCallTypeAllowed = resp && resp.preEstCallTypeAllowed ? resp.preEstCallTypeAllowed : {};
        let callOnHold = JSON.parse(global.config.CALL_ON_HOLD);
        return {
            impu: IMPU,
            impi: IMPI,
            domain: domain,
            registrar_server: asPSI,
            realm: realm,
            uri: `${IMPU}@${domain}`,
            contact_uri: `sip:${IMPU}@${domain}`,
            password: '12345678',
            display_name: '',
            sockets: [socket],
            register_expires: register_expires,
            authorization_user: `${IMPI}@${domain}`,
            hack_ip_in_contact: true,
            ws_server: `wss://${host}:${global.config.ipConfig.wssPort}`,
            stun_servers: 'stun:192.168.1.50:3478',
            turn_servers: 'turn:192.168.1.50:3478',
            pbxDomain: pbxDomainConfig,
            domainsConfig: domains,
            register: true,
            user_agent: `Dispatcher`,
            contentType: 'application/vnd.3gpp.mcptt-info+xml',
            response_timer: '16',
            totalPreEstSessionCount: totalPreEstSessionCount,
            preEstCallTypeAllowed: preEstCallTypeAllowed,
            privatePreEstCallsAllowed: privatePreEstCallsAllowed,
            callOnHold: callOnHold,
            isManualCallHandle: true
        }
    }
    //contentType: 'application/vnd.3gpp.mcptt-info+xml',
    //contentType: 'multipart/mixed; boundary=boundary',

    getConfig() {
        const _this = this
        let domains = null
        let systemDgnaSSIs = null
        let enableDgna = false;
        let enableAmbienceListening = false;
        let enablePatchCall = false;
        let enableCadCall = false;
        let enableMergeCall = false;
        let enableCallForwarding = false
        return new Promise((resolve, reject) => {
            let path = `https://${global.config.ipConfig.host}:${process.env.REACT_APP_CMS_PORT}/consort/getInitialConfig`
            console.log('config host path', path)
            axios.get(path).then(
                res => {
                    console.log('config host resp', res, res.data.domains)
                    if (res.data && res.data.ports) {
                        let ports = res.data.ports
                        let ip = res.data.ip
                        if (ip.hostIp)
                            global.config.ipConfig.host = ip.hostIp;
                        if (ip.drachtioHost)
                            global.config.ipConfig.drachtioHost = ip.drachtioHost;
                        if (ip.idmsHost)
                            global.config.ipConfig.idmsHost = ip.idmsHost;
                        if (ip.dispatcherHost)
                            global.config.ipConfig.dispatcherHost = ip.dispatcherHost;
                        if (ip.risHost)
                            global.config.ipConfig.risHost = ip.risHost;
                        if (ports.cmsPort) {
                            global.config.ipConfig.cmcPort = ports.cmsPort;
                        }
                        if (ports.MCX_PORT) {
                            global.config.ipConfig.dispatcherServerPort = ports.MCX_PORT;
                        }
                        if (ports.defaultPort) {
                            global.config.ipConfig.defaultPort = ports.defaultPort;
                        }
                        if (ports.gmsPort) {
                            global.config.ipConfig.gmcPort = ports.gmsPort;
                        }
                        if (ports.idmsPort) {
                            global.config.ipConfig.idmsPort = ports.idmsPort;
                        }
                        if (ports.iwfPort) {
                            global.config.ipConfig.iwfPort = ports.iwfPort;
                        }
                        if (ports.wsPort) {
                            global.config.ipConfig.wsPort = ports.wsPort;
                        }
                        if (ports.wssPort) {
                            global.config.ipConfig.wssPort = ports.wssPort;
                        }
                        if (ports.userApiPort) {
                            global.config.ipConfig.userApiPort = ports.userApiPort;
                        }
                    }
                    if (res.data && res.data.domains) {
                        console.log('config host resp domains', res)
                        domains = res.data.domains
                    }
                    if (res.data && res.data.systemDgnaSSIs) {
                        systemDgnaSSIs = res.data.systemDgnaSSIs
                    }
                    if (res.data && res.data.hasOwnProperty('dgnaFeature')) {
                        enableDgna = res.data.dgnaFeature;
                    }
                    if (res.data && res.data.hasOwnProperty('ambienceListeningFeature')) {
                        enableAmbienceListening = res.data.ambienceListeningFeature
                    }
                    if (res.data && res.data.hasOwnProperty('patchCallFeature')) {
                        enablePatchCall = res.data.patchCallFeature;
                        //callPatchFeature
                    }
                    if (res.data && res.data.hasOwnProperty('mergeCallFeature')) {
                        enableMergeCall = res.data.mergeCallFeature;
                        //callPatchFeature
                    }
                    if (res.data && res.data.hasOwnProperty('cadCallFeature')) {
                        enableCadCall = res.data.cadCallFeature
                    }
                    if (res.data && res.data.hasOwnProperty('forwardingCallFeature')) {
                        enableCallForwarding = res.data.forwardingCallFeature
                    }

                    let mcx = _this.createMCXClient(domains, res.data)
                    let response = {
                        mcx: mcx,
                        domains: domains,
                        systemDgnaSSIs: systemDgnaSSIs,
                        enableDgna: enableDgna,
                        enableAmbienceListening: enableAmbienceListening,
                        enablePatchCall: enablePatchCall,
                        enableCadCall: enableCadCall,
                        enableMergeCall: enableMergeCall,
                        enableCallForwarding: enableCallForwarding
                    }
                    resolve(response)
                },
                err => {
                    console.log('config host resp err', err)
                    let mcx = _this.createMCXClient(domains)
                    let response = {
                        mcx: mcx,
                        domains: domains,
                        systemDgnaSSIs: systemDgnaSSIs
                    }
                    resolve(response)
                }
            ).catch(
                err => {
                    console.log('config host resp err try', err)
                    let mcx = _this.createMCXClient(domains)
                    let response = {
                        mcx: mcx,
                        domains: domains,
                        systemDgnaSSIs: systemDgnaSSIs
                    }
                    resolve(response)
                }
            )
        })
    }

    createMCXClient = (domains, resp) => {
        const socket = new WebSocketInterface(`wss://${global.config.ipConfig.drachtioHost}:${global.config.ipConfig.wssPort}`);
        if (socket) {
            console.log('socket connected!!');
        }
        const conf = this.config(global.config.ipConfig.host, socket, domains, resp);
        let mcxClientL = new MCXClient(conf);
        return mcxClientL
    }


    // generateString(length) {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let result = ' ';
    //     const charactersLength = characters.length;
    //     for (let i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }
}

export default MCXClientConfig