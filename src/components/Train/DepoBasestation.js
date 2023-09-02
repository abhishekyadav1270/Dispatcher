import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ContextMenu } from '../commom';
import { getStationRadioId } from '../../utils/lib';
import { Tooltip, OverlayTrigger, Overlay, Popover } from 'react-bootstrap';

const DepoBasestation = (props) => {
    const { stncode, basestations, stationRadios } = props;
    const tetraId = getStationRadioId(stationRadios, stncode);
    let stnname = "Charkop"
    let isBaseStn = basestations.findIndex((item) => item.location == stncode)
    let basestnVal = {}
    if (isBaseStn != -1) {
        basestnVal = basestations[isBaseStn];
        isBaseStn = true;
        stnname = basestnVal.station ? basestnVal.station : "Charkop"
    }
    else isBaseStn = false

    console.log('basestations...', basestations, stationRadios, tetraId, basestnVal)

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <p class='f-header-14b'>{props.stn && props.stn.split(/ /g).map(word => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`).join(" ")}</p>
            {props.data.isBaseStn &&
                <div>
                    <div class='partition' />
                    <p class='f-detail-14'>{'Base Station : ' + props.data.location}</p>
                    <p class='f-detail-14'>{'Node No : ' + props.data.nodeNumber}</p>
                </div>
            }
        </Tooltip>
    );

    const getStatus = (status) => {
        switch (status) {
            case '1':
            case 1:
                return 'rgb(221, 148, 39)' // Yellow
            case '2':
            case 2:
                return 'rgb(128,0,128)' // Magenta
            case '0':
            case 0:
                return 'rgb(44, 238, 37)' // Green
            case '3':
            case 3:
                return 'red' // Red
            case '4':
            case 4:
                return 'gray' // Gray    

            default:
                break;
        }
    }

    return (
        <ContextMenu id={stncode} type={'TS'} subr={tetraId} paId={tetraId} routeName={'stn'} style={{ display: 'flex', flex: 1, width: '136px', height: '100%' }} >
            <div style={{ display: 'flex', flex: 1, width: '136px', height: '100%' }}>
                <div style={{
                    borderRadius: '8px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)', width: '136px',
                    backgroundColor: getStatus(basestnVal.status), alignItems: 'center', justifyContent: 'center'
                }}>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip({ stn: stnname, data: { ...basestnVal, isBaseStn } })}
                    >
                        <div class="f-stn" style={{ display: 'flex', fontSize: '13px', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '8.7px' }}>{stncode}</div>
                    </OverlayTrigger>
                </div>
            </div>
        </ContextMenu>
    )
}

const mapStateToProps = ({ train }) => {
    const { basestations, stationRadios } = train;
    return {
        basestations,
        stationRadios
    };
};

export default connect(mapStateToProps, {})(DepoBasestation);