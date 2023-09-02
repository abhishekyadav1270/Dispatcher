import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap'

//Other
import { systemDGID } from '../../constants/constants';
import MenuQuickAction from './MenuQuickAction';

const systemDgOptns = [
    { text: "Live PA", value: "livePA" },
    { text: "Emergency", value: "broadcastCall" },
]
const QuickAction = (props) => {
    const [selectedHotkey, setSelectedHotkey] = useState("");
    const [showAction, setShowAction] = useState(false);
    const [dgId, setDgId] = useState("");
    const [actionType, setActionType] = useState('');
    const [systemDGData, setIds] = useState([]);

    //PROPS
    const { line } = props;

    useEffect(() => {
        try {
            let systemDg = systemDGID ? JSON.parse(systemDGID) : [];
            if (systemDg.length) setIds(systemDg)
            console.log('system dgna ID', systemDGID, line)
        }
        catch (e) {
            console.log('DG', e)
        }

    }, [])
    //functions
    const updateHotkey = (val, type) => {
        console.log('system dgna...', systemDGData, type, val, line)
        const dgnaIds = systemDGData.filter(type => type.line == line);
        if (dgnaIds.length > 0) {
            let ids = dgnaIds[0].ids
            let selIndex = 0;
            if (type === "up") selIndex = 0;
            if (type === "down") selIndex = 1;
            if (type === "all") selIndex = 2;
            //console.log('system dgna inside...', line, systemDGData, type, ids, selIndex, ids[selIndex])
            setSelectedHotkey(val)
            setActionType(val)
            setDgId(ids[selIndex])
            setShowAction(true)
            setTimeout(() => {
                setSelectedHotkey("")
            }, 500);
        } else {
            setShowAction(false)
        }
    }

    return (
        <React.Fragment>
            <div class="m-l-10" style={{ position: 'absolute', bottom: 0 }}>
                <p class="f-text-10 all-caps ml-1 m-b-10" style={{ color: '#8A98AC' }}>Hot Keys {line}</p>
                <HotKeys type='Up' options={systemDgOptns} selected={selectedHotkey} setChange={(val) => updateHotkey(val, "up")} />
                <HotKeys type='Down' options={systemDgOptns} selected={selectedHotkey} setChange={(val) => updateHotkey(val, "down")} />
                <HotKeys type='All' options={systemDgOptns} selected={selectedHotkey} setChange={(val) => updateHotkey(val, "all")} />
            </div>
            {showAction ?
                <MenuQuickAction
                    open={showAction}
                    closeModal={(v) => setShowAction(v)}
                    type={actionType}
                    id={dgId}
                />
                : null}
        </React.Fragment>
    )
}

const HotKeys = (props) => {
    const { type, options, selected, setChange } = props;
    return (
        <button
            class="btn btn-rgba-quick-link m-r-10"
            style={{ color: '#fff' }}
            onClick={() => setChange("broadcastCall")}
        >{type}
        </button>
    )
}

const mapStateToProps = ({ communication }) => {
    const { contactList } = communication;
    return {
        contactList
    };
};

export default connect(mapStateToProps, {})(QuickAction);


/*
"systemDgnaSSI": [{"name": "ALL","ssi": 9001},
            {"name": "TB_UP_NS","ssi": 9002},
            {"name": "TB_UP_EW","ssi": 9003},
            {"name": "TB_DN_NS","ssi": 9004},
            {"name": "TB_DN_EW","ssi": 9005}
        ]
        */