import React, { useState, useEffect } from 'react'
import { Title } from "../commom/Title";
import CallRecordTableRow from './CallRecordTableRow';
import { Modal as ModalBootStrap } from "react-bootstrap";
import { Grid, makeStyles, Typography, Button } from '@material-ui/core';
import CallRecordInfoTab from './CallRecordInfoTab';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import './player.css'
// import ArchiveRecordings from './ArchiveRecordings';
import InfiniteScroll from "react-infinite-scroll-component";
import { getCallRecord, 
    setPage, 
    // setTotalPage, setHasMore, setLoader, setShowingNextData 
} from "../../modules/actions/playerAction";

const CallRecordTable = (props) => {
    const { callRecord, pagination, callRecordReqObj, 
        // currentPage, 
        // totalPage, hasMore, loading, showingNextData
    } = props;
    const [filtered, setFiltered] = useState();
    const [lastfiltered, setLastFiltered] = useState();
    const [isSearch, setSearched] = useState(false);
    const [isCallInfoModalOpen, setIsCallInfoModalOpen] = useState(false);
    const [isCallRecordSelected, setCallRecordSelected] = useState();

    // const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoader] = useState(false);
    const [showingNextData, setShowingNextData] = useState(false);
    const totalPageSize = 20;

    useEffect(() => {
        if (!isSearch) {
            setFiltered(callRecord);
            setLastFiltered(callRecord);
            setLoader(false)
            if(pagination && pagination.totalPages && pagination.currentPage){
                setTotalPage(pagination.totalPages)
                if(pagination.totalPages != pagination.currentPage)
                    setHasMore(true);
            }
            setPage(pagination.currentPage);
            setShowingNextData(false);
        }
        console.log("call record data :", currentPage);
    }, [callRecord])


    const searchRecord = (searchRecord) => {
        let filterRecord;
        const search = searchRecord.toLowerCase();
        if (search) {
            filterRecord = lastfiltered.filter(record =>
                (record.callID && record.callID.toLowerCase().includes(search)) ||
                (record.callerId && record.callerId.toString().toLowerCase().includes(search)) ||
                (record.calleeId && record.calleeId.toString().toLowerCase().includes(search)) ||
                (record.groupId && record.groupId.toLowerCase().includes(search))
            )
            setFiltered(filterRecord);
            setSearched(true);
        }
        else {
            setFiltered(lastfiltered);
            setSearched(false);
        }
    }

    const userFilterModalhandleClose = () => {
        setIsCallInfoModalOpen(false);
        setCallRecordSelected(null);
    };

    const handleShowModal = (data, idx) => {
        console.log("handle show modal----", data);
        setIsCallInfoModalOpen(true);
        setCallRecordSelected(data);
    }


    // const archiveModalhandleClose = () => {
    //     setIsArchiveModalOpen(false);
    // };
    // const handleShowArchiveButton = () => {
    //     setIsArchiveModalOpen(true);
    // }

    const getCallRecordList = (filterData) => {
        let params = callRecordReqObj;
        params.page = filterData.page;
        params.limit = totalPageSize;
        console.log("show button is clicked", params);
        props.getCallRecord(params);
    }

    const fetchPage = (page) => {
        let filterData = {
            page: page
        }
        console.log('fetchPage -->',page);
        setPage(page)
        setLoader(true);
        getCallRecordList(filterData)
    }

    const getMoreData = () => {
        console.log('getMoreData scroll..', currentPage, totalPage)
        if (currentPage === totalPage) {
            setHasMore(false);
            return;
        }
        setLoader(true)
        setShowingNextData(true)
        fetchPage(currentPage + 1)
    }
    return (
        <div>
            {/* <Grid container direction="row"
            >
                <Grid item xs={10}>
                    <Title title="Call Recordings" type="TD" />
                </Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "end" }} >
                    <Button style={{ backgroundColor: "#ffb01f", color: "black", width: "80%" }} variant="container" onClick={handleShowArchiveButton}>Show Archives</Button>
                </Grid>
            </Grid> */}

            <div class="player-row-grid-head">
                <div class="plr-tb-clrid  train-cell-center ">
                    <span>Caller</span>
                </div>
                <div class=" plr-tb-cleid train-cell-center ">
                    <span>Callee</span>
                </div>
                <div class=" plr-tb-groupId train-cell-center ">
                    <span>Group</span>
                </div>
                <div class="plr-tb-strtm train-cell-center ">
                    <span>Start Time</span>
                </div>
                <div class="plr-tb-endtm train-cell-center">
                    <span>End Time</span>
                </div>
                <div class="plr-tb-dur train-cell-center train-cell-ml-30 ">
                    <span>Call Duration</span>
                </div>
                {/* <div class="plr-tb-sesstype train-cell-center">
                    <span>Session Type</span>
                </div> */}
                <div class="plr-tb-calltype train-cell-center">
                    <span>Call Type</span>
                </div>
                <div class="plr-tb-ansmode train-cell-center">
                    <span>Answer Mode</span>
                </div>
                <div class="plr-tb-floorCntrl train-cell-center ">
                    <span>Floor Control</span>
                </div>
                {/* <div class="plr-tb-fa train-cell-center">
                    <span>FA call </span>
                </div>
                <div class="plr-tb-cad  train-cell-center">
                    <span>CAD call </span>
                </div> */}
            </div>
            <div id="scrollableDivCallRecord" style={{ height: "686px", overflowY: "auto" }} >
                {callRecord ? <InfiniteScroll
                    dataLength={callRecord.length}
                    next={getMoreData}
                    hasMore={hasMore}
                    loader={loading ? <div class='al-center'><p class='white'>Loading</p></div> : <div></div>}
                    scrollableTarget='scrollableDivCallRecord'
                >
                    {callRecord  && callRecord.map((data, idx) => {
                        return (
                            <div className="playerTable-row-grid" key={idx} onClick={(idx) => handleShowModal(data, idx)}>
                                < CallRecordTableRow data={data} />
                            </div>
                        );
                    }
                    )}
                </InfiniteScroll> : <div>
                    {callRecord && callRecord.length === 0 ?
                        <div
                            class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                            style={{ height: '445px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >{isSearch ? 'No Record found' : ''}
                        </div>
                        : null}
                </div>}
                {filtered && filtered.length === 0 ? (
                    <div
                        className="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                        style={{
                            height: "445px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* {isSearch ? "No match found" : "No trains available"} */}
                    </div>
                ) : null}
            </div>
            <ModalBootStrap
                show={isCallInfoModalOpen}
                onHide={userFilterModalhandleClose}
                scrollable={true}
                // size={"xl"}
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="modal-65w"
                centered
                style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
                className="special_modal"
            >
                <ModalBootStrap.Header
                    closeButton
                    style={{ border: "0px", backgroundColor: "#282828" }}
                >
                    <ModalBootStrap.Title>Call Record Info</ModalBootStrap.Title>
                </ModalBootStrap.Header>
                <ModalBootStrap.Body
                    style={{
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        border: 2,
                        p: 1,
                        padding: "8px",
                        margin: "2px",
                        marginLeft: "20px",
                        marginRight: "20px",
                        backgroundColor: "#121212",
                        borderRadius: "16px"
                    }}
                >
                    {isCallRecordSelected ? <CallRecordInfoTab data={isCallRecordSelected} /> : ""}
                </ModalBootStrap.Body>
            </ModalBootStrap>

            {/* <ModalBootStrap
                show={isArchiveModalOpen}
                onHide={archiveModalhandleClose}
                scrollable={true}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                // dialogClassName="modal-65w"
                centered
                style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
                className="special_modal"
            >
                <ModalBootStrap.Header
                    closeButton
                    style={{ border: "0px", backgroundColor: "#282828" }}
                >
                    <ModalBootStrap.Title>Archival Management</ModalBootStrap.Title>
                </ModalBootStrap.Header>
                <ModalBootStrap.Body
                    style={{
                        bgcolor: "background.paper",
                        minHeight: "45vh",
                        boxShadow: 1,
                        border: 2,
                        margin: "8px",
                        backgroundColor: "#121212",
                        borderRadius: "16px",
                        padding: "0px"
                    }}
                >
                    <ArchiveRecordings />
                </ModalBootStrap.Body>
            </ModalBootStrap> */}
        </div>
    )
}

const mapStateToProps = ({ player }) => {
    return {
        callRecord: player.callRecord,
        pagination: player.pagination,
        callRecordReqObj: player.callRecordReqObj,
        currentPage: player.currentPage,
        totalPage: player.totalPage,
        hasMore: player.hasMore,
        loading: player.loading,
        showingNextData: player.showingNextData
    }
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            getCallRecord,
            setPage,
            // setTotalPage, setHasMore, setLoader, setShowingNextData
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(CallRecordTable);