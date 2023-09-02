import React, { useState, useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import { addFAAdmin, updateFAAdmin, fetchFAAdminDetail, fetchFAListAdmin, getIWFMapByFa, resetIWFMapByFa } from '../../modules/adminstate';
import { connect } from "react-redux";
import IwFMapView from "./AdminWidget/AddIwfMap/IwFMapView";

const FATemplates = (props) => {
    const DefaultInfoData = {
        id: "",
        type: "",
        fa: "",
        mcpttId: "",
        fa_mcpttid: "FA",
        errors: {}
    };
    const { addFAAdmin, fetchFAAdminDetail, faProfileDetail, fetchFAListAdmin, configDomain, getIWFMapByFa, faIWFMap, updateFAAdmin, iwfMaplist, resetIWFMapByFa, propsTetra } = props
    const [faDetails, setFADetails] = useState({
        uri: '',
        description: '',
        tetra: false,
        iwf: DefaultInfoData
    })

    const [btnDisabled, setBtnDisabled] = useState(true)
    const [btnText, setBtnText] = useState('SUBMIT')
    const [profileName, setProfileName] = useState(null)
    const [emptyURI, setEmptyURI] = useState(false)
    const [emptyDescription, setEmptyDescription] = useState(false)
    const [tetraDisable, settetraDisable] = useState(false)

    useEffect(() => {
        resetIWFMapByFa()
        if (props.faName) {
            fetchFAAdminDetail(props.faName)
            getIWFMapByFa(props.faName)
        }
        else {
            let ttUser = false
            if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0 && configDomain.mcxDomain && configDomain.mcxDomain !== "") {
                // Enable tetra in this case
                console.log("tetra domain check running ", " COND 1")
            }
            else {
                console.log("tetra domain check running ", " else")
                settetraDisable(true)
                if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
                    ttUser = true
                    console.log("tetra domain check running ", " COND 2")
                }
                else if (configDomain.mcxDomain && configDomain.mcxDomain !== "") {
                    console.log("tetra domain check running ", " COND 3")
                    ttUser = false
                }
            }

            let faupdate = {
                ...faDetails,
                tetra: ttUser
            }
            console.log("tetra domain setting ", faupdate)
            setFADetails(faupdate)
        }
    }, [])
    useEffect(() => {
        console.log("FA faIWFMap", faIWFMap)
        if (props.faName && faIWFMap && faIWFMap.id) {
            iwfMapHandler(faIWFMap)
        }
    }, [faIWFMap])

    useEffect(() => {
        console.log('faProfileDetail', faProfileDetail)
        if (faProfileDetail && faProfileDetail.faList) {
            console.log('faProfileDetail', "setting data")
            setProfileName(faProfileDetail.profileName)
            let fa = { ...faProfileDetail.faList, iwf: faIWFMap }
            setFADetails(fa)
            setBtnDisabled(false)
            setBtnText('Update')
        }
    }, [faProfileDetail])

    const useStyles = makeStyles((theme) => ({
        formControl: {
            width: '100%',
            marginTop: '5px',
        },
        tetraSwitch: {
            fontFamily: 'Muli',
            marginTop: '2px',
            marginRight: '1px'
        },
        listItemFA: {
            padding: '5px',
            fontFamily: 'Muli'
        },
    }));

    const tetraTrueFalse = (e) => {
        let faupdate = {
            ...faDetails,
            tetra: e.target.checked
        }
        setFADetails(faupdate)
    };

    const iwfMapHandler = (value) => {
        let faupdate = {
            ...faDetails,
            iwf: value
        }
        setFADetails(faupdate)
    };

    const descChangeHandler = (e) => {
        let faupdate = {
            ...faDetails,
            description: e.target.value
        }
        setFADetails(faupdate)
        if (e.target.value.length > 0) {
            setBtnDisabled(false)
            setEmptyDescription(false)
        } else {
            setBtnDisabled(true)
            setEmptyDescription(true)
        }
    };

    const updateFA = () => {
        let errors = {}
        console.log('iwfMaplist........', iwfMaplist)
        if (faDetails.tetra && !faDetails.iwf.id) {
            errors["id"] = "Please enter iwf id"
            setFADetails({
                ...faDetails,
                iwf: { ...faDetails.iwf, errors: errors, }
            })
        }
        else if (faDetails.tetra && !(props.faName) && iwfMaplist && iwfMaplist.some((obj) => obj.id === faDetails.iwf.id)) {
            errors["id"] = "SSI already exits"
            setFADetails({
                ...faDetails,
                iwf: { ...faDetails.iwf, errors: errors, }
            })
        }
        else if (faDetails.tetra && (!faDetails.iwf.type || (faDetails.iwf.type && faDetails.iwf.type.length === 0))) {
            // e.preventDefault()
            errors["type"] = "Please select type"
            setFADetails({
                ...faDetails,
                iwf: { ...faDetails.iwf, errors: errors, }
            })
        }
        else if (faDetails.description.length === 0) {
            setEmptyDescription(true)
        }
        else {
            let profile = {}
            if (profileName) {
                profile['profileName'] = profileName
            } else {
                let profileNameL = faDetails.description.replace(/\s+/g, '').toLocaleUpperCase()
                profile['profileName'] = profileNameL
            }
            profile['CallerDescr'] = faDetails.description
            //mcpttID
            profile['faList'] = { ...faDetails }
            let mappedDomain = null
            if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
                for (let index = 0; index < configDomain.iwfs.length; index++) {
                    const element = configDomain.iwfs[index];
                    if (faDetails && faDetails.iwf && faDetails.iwf.type) {
                        if (element.type && element.type.toLocaleUpperCase() == faDetails.iwf.type.toLocaleUpperCase()) {
                            mappedDomain = element.mappedDomain
                        }
                    }
                }
                if (mappedDomain) {
                    profile = { ...profile, domain: mappedDomain }
                } else {
                    profile = { ...profile, domain: configDomain.mcxDomain ? configDomain.mcxDomain : '' }
                }
            } else {
                profile = { ...profile, domain: configDomain.mcxDomain ? configDomain.mcxDomain : '' }
            }
            profile['tetra'] = faDetails.tetra
            profile['faList'] = { ...faDetails, uri: profile['profileName'] + "@" + profile.domain }
            if (faDetails.tetra === true) {
                profile['faList'] = {
                    ...faDetails
                    , uri: profile['profileName'] + "@" + profile.domain,
                    iwf: { ...faDetails.iwf, fa: profile['profileName'], edit: propsTetra === faDetails.tetra }
                }
            }
            console.log("SENDING FA REQ", JSON.stringify(profile))
            addFAAdmin(profile)
            setTimeout(() => {
                fetchFAListAdmin()
            }, 1000);
            resetIWFMapByFa()
            props.hideModal()
        }
    }

    const classes = useStyles();
    return (
        <div style={{ height: '80%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div class="fa-template-uri">
                <FormControlLabel className={classes.tetraSwitch}
                    value="start"
                    control={<Switch color='primary' checked={faDetails.tetra} onChange={tetraTrueFalse} />}
                    label="Iwf"
                    labelPlacement='start'
                    disabled={props.faName ? props.faName : tetraDisable}
                    onChange={tetraTrueFalse}
                />
                {
                    faDetails.tetra === true ?
                        (
                            <IwFMapView class="input-control" fromFA={true} iwfMapHandler={iwfMapHandler} infoData={faDetails.iwf} purpose={(propsTetra === faDetails.tetra) ? 'edit' : 'create'} mappedFilter={true} hideIwfIdView={false}></IwFMapView>
                        )
                        :
                        null
                }
                <label class="attribute-heading-padding">FA Name*</label>
                <input
                    type="text"
                    class="input-control"
                    id="description"
                    value={faDetails.description}
                    onChange={descChangeHandler}
                />
                {
                    emptyDescription === true ?
                        (
                            <label class="error-handling-lbl">Please enter FA name</label>
                        )
                        :
                        null
                }
            </div>
            <button
                class="update-btn-profile"
                type="button"
                onClick={updateFA}
            >
                {btnText}
            </button>
        </div>
    )
}

const mapStateToProps = ({ adminstate, domains }) => {
    const { faProfileDetail, faIWFMap, iwfMaplist } = adminstate;
    //console.log('userlist reducer', userlist)
    const { configDomain } = domains
    return {
        faProfileDetail,
        configDomain,
        faIWFMap,
        iwfMaplist
    };
};

export default connect(mapStateToProps, {
    addFAAdmin,
    updateFAAdmin,
    fetchFAAdminDetail,
    fetchFAListAdmin,
    getIWFMapByFa,
    resetIWFMapByFa
})(FATemplates);
