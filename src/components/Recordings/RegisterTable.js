import React, { useState, useEffect } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { getCallRecord, 
    setPage, 
    // setTotalPage, setHasMore, setLoader, setShowingNextData 
} from "../../modules/actions/playerAction";
import RegisterTableRow from './RegisterTableRow';
import { Modal as ModalBootStrap } from "react-bootstrap";
import RegisterRecordInfoTab from './RegisterRecordInfoTab';

const RegisterTable = (props) => {
    const { callRecord, pagination, callRecordReqObj } = props;

    const [isSearch, setSearched] = useState(false);
    const [filtered, setFiltered] = useState();
    const [lastfiltered, setLastFiltered] = useState();
    const [isRegisterInfoModalOpen, setIsRegisterInfoModalOpen] = useState(false);
    const [isRegisterRecordSelected, setRegisterRecordSelected] = useState();

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

    const userFilterModalhandleClose = () => {
        setIsRegisterInfoModalOpen(false);
        setRegisterRecordSelected(null);
    }

    const handleShowModal = (data, idx) => {
        console.log("handle show modal----", data);
        setIsRegisterInfoModalOpen(true);
        setRegisterRecordSelected(data);
    }
    return (
        <React.Fragment>
            <div class="rgstr-row-grid-head">
                <div class="rgstr-tb-user train-cell-center ">
                    <span>User</span>
                </div>
                <div class="rgstr-tb-ua train-cell-center ">
                    <span>UA</span>
                </div>
                <div class="rgstr-tb-userType train-cell-center ">
                    <span>User Type</span>
                </div>
                <div class="rgstr-tb-time train-cell-center ">
                    <span>Time</span>
                </div>
                <div class="rgstr-tb-type train-cell-center">
                    <span>Type</span>
                </div>
                <div class="rgstr-tb-ueid train-cell-center ">
                    <span>UEID</span>
                </div>
                <div class="rgstr-tb-impu train-cell-center ">
                    <span>IMPU</span>
                </div>
            </div>


            <div id="scrollableDivCallRecord" style={{ height: "686px", overflowY: "auto" }} >
                { callRecord ? <InfiniteScroll
                    dataLength={callRecord.length}
                    next={getMoreData}
                    hasMore={hasMore}
                    loader={loading ? <div class='al-center'><p class='white'>Loading</p></div> : <div></div>}
                    scrollableTarget='scrollableDivCallRecord'
                >
                    {callRecord && callRecord.map((data, idx) => {
                        return (
                            <div className="rgstr-row-grid" key={idx} onClick={(idx) => handleShowModal(data, idx)}>
                                <RegisterTableRow data={data} />
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
                show={isRegisterInfoModalOpen}
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
                    <ModalBootStrap.Title>Registeration</ModalBootStrap.Title>
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
                    {isRegisterRecordSelected ? <RegisterRecordInfoTab data={isRegisterRecordSelected} /> : ""}
                </ModalBootStrap.Body>
            </ModalBootStrap>
        </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTable);