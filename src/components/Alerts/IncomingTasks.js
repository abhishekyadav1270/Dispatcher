import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setRefresh, updateAlertTabOption } from '../../modules/activityLog';
import { getAllTasks, getActiveTaskCount, updateAlertBeepTasks } from '../../modules/task';
import { getAlerts } from '../../modules/alarm';
import { Title } from '../commom';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import ViewModuleIcon from '@mui/icons-material/ViewModule';
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TaskRenderer from '../Tasks/list/taskrenderer';
import TaskCardRenderer from '../Tasks/card/taskCardRenderer';
import { EndPoints } from '../../MCXclient/endpoints';
import axios from 'axios';
import { RefreshRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import InfiniteScroll from "react-infinite-scroll-component";

const IncomingTasks = (props) => {
    const [Menuoptions, setMenuOptions] = useState([
        { name: "Incoming Alerts", value: 1, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        { name: "Acknowledged Alerts", value: 2, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        { name: "Emergency Alerts", value: 4, id: "pills-contact-tab", href: "#pills-marked", aria: "pills-contact" },
    ]);
    const [selected, setSelected] = useState(1);
    const [isSearch, setSearched] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [initialFetch, setFetch] = useState(true);
    const { user, tasks, activeTaskCount, updateAlertTabOption, taskRefresh, getAllTasks, getActiveTaskCount, activeTab, updateAlertBeepTasks, setRefresh } = props;
    const [selectedDisplay, setSelectedDisplay] = useState('list');
    const [allTasks, setAllTasks] = useState([]);
    const [taskType, setTaskType] = useState(new Map())

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoader] = useState(false);
    const [showingNextData, setShowingNextData] = useState(false);
    const totalPageSize = 15;

    const handleChange = (event, nextView) => {
        //setSelectedDisplay(nextView);
        setSelectedDisplay('list');
    };

    useEffect(() => {
        if (selected === 1 && initialFetch) {
            getTaskType()
        }
    }, [])

    useEffect(() => {
        console.log('use effect allTasks...', tasks)
        setLoader(false)
        if (tasks) {
            if (tasks.status === "Success" && tasks.data) {
                if (tasks.filter && tasks.filter.taskStatus) {
                    if (selected == 2) {
                        if (tasks.pagination && tasks.pagination.totalPages && tasks.pagination.currentPage) {
                            setTotalPage(tasks.pagination.totalPages)
                            if (tasks.pagination.totalPages != tasks.pagination.currentPage) {
                                setHasMore(true)
                            }
                        }
                        if (showingNextData) {
                            let tasksAll = [...allTasks, ...tasks.data]
                            setAllTasks(tasksAll)
                        } else {
                            if (tasks.pagination && tasks.pagination.currentPage == 1) {
                                setAllTasks(tasks.data)
                            } else {
                                let tasksAll = [...allTasks, ...tasks.data]
                                setAllTasks(tasksAll)
                            }
                        }
                    }
                } else if (tasks.filter && tasks.filter.description) {
                    if (selected == 4) {
                        if (tasks.pagination && tasks.pagination.totalPages && tasks.pagination.currentPage) {
                            setTotalPage(tasks.pagination.totalPages)
                            if (tasks.pagination.totalPages != tasks.pagination.currentPage) {
                                setHasMore(true)
                            }
                        }
                        if (showingNextData) {
                            let tasksAll = [...allTasks, ...tasks.data]
                            setAllTasks(tasksAll)
                        } else {
                            if (tasks.pagination && tasks.pagination.currentPage == 1) {
                                setAllTasks(tasks.data)
                            } else {
                                let tasksAll = [...allTasks, ...tasks.data]
                                setAllTasks(tasksAll)
                            }
                        }
                    }
                } else {
                    if (selected == 1) {
                        if (tasks.pagination && tasks.pagination.totalPages && tasks.pagination.currentPage) {
                            setTotalPage(tasks.pagination.totalPages)
                            if (tasks.pagination.totalPages != tasks.pagination.currentPage) {
                                setHasMore(true)
                            }
                        }
                        if (showingNextData) {
                            let tasksAll = [...allTasks, ...tasks.data]
                            setAllTasks(tasksAll)
                            checkRestrictedAlarm(tasksAll)
                        } else {
                            if (tasks.pagination && tasks.pagination.currentPage == 1) {
                                setAllTasks(tasks.data)
                                checkRestrictedAlarm(tasks.data)
                            } else {
                                let tasksAll = [...allTasks, ...tasks.data]
                                setAllTasks(tasksAll)
                                checkRestrictedAlarm(tasksAll)
                            }
                        }
                    }
                }
            }
            else if (tasks.status === "Failed") {
                //setAllTasks([])
                //setIncomingAlertsCount(0)
            }
        }
        setShowingNextData(false)
    }, [tasks])

    useEffect(() => {
        console.log("activeTab action taskRefresh useEffect", taskRefresh, selected)
        if (taskRefresh) {
            setTimeout(() => {
                fetchTasks(selected)
                setRefresh('task', false)
            }, 500);
        }
    }, [taskRefresh])

    const fetchTasks = (tab) => {
        if (selected != tab) {
            setAllTasks([])
        }
        const tabType = tab === 1 ? 'inc' : tab === 2 ? 'COMPLETED' : 'EMERGENCY'
        setSelected(tab)
        updateAlertTabOption(tabType)
        let filterData = {
            page: 1
        }
        if (tabType === "EMERGENCY") {
            filterData = {
                ...filterData,
                filter: {
                    description: tabType
                }
            }
        }
        else if (tabType === "COMPLETED") {
            filterData = {
                ...filterData,
                filter: {
                    taskStatus: tabType,
                }
            }
        } else {
            filterData = {
                ...filterData,
                filter: {}
            }
        }
        setPage(1)
        setLoader(true)
        setHasMore(true)
        setTotalPage(1)
        setShowingNextData(false)
        getTaskList(filterData)
    }

    const fetchPage = (page) => {
        const tabType = selected === 1 ? 'inc' : selected === 2 ? 'COMPLETED' : 'EMERGENCY'
        let filterData = {
            page: page
        }
        updateAlertTabOption(tabType)
        if (tabType === "EMERGENCY") {
            filterData = {
                ...filterData,
                filter: {
                    description: tabType
                }
            }
        }
        else if (tabType === "COMPLETED") {
            filterData = {
                ...filterData,
                filter: {
                    taskStatus: tabType,
                }
            }
        } else {
            filterData = {
                ...filterData,
                filter: {}
            }
        }
        setPage(page)
        setLoader(true);
        getTaskList(filterData)
    }

    const onTaskAcknowledge = () => {
        fetchTasks(selected)
    }

    const getTaskList = (filterData) => {
        let reqObj = {
            mcxId: user && user.profile.mcptt_id,
            falist: [global.config.faID],
            sort: ["createdAt", "taskPriority"],
            filter: filterData.filter, // des: emergency
            pagination: { page: filterData.page, size: totalPageSize }
        }
        console.log("fetch task called REQ ", JSON.stringify(reqObj), selected);
        getAllTasks(reqObj)

        let refCountObj = {
            mcxId: user && user.profile.mcptt_id,
            falist: [global.config.faID]
        }
        setTimeout(() => {
            getActiveTaskCount(refCountObj)
        }, 500);
    }

    const getTaskType = () => {
        axios
            .get(EndPoints.getConfig().taskType)
            .then(
                (res) => {
                    if (res.data) {
                        console.log("TASK TYPE RES ", JSON.stringify(res.data));
                        let data = res.data;
                        if (data.length > 0) {
                            let MyTaskMap = new Map()
                            data.map((d) => {
                                let key = d.taskType
                                let value = d.reactJS
                                MyTaskMap.set(key, value)
                            })
                            setTaskType(MyTaskMap)
                            fetchTasks(1)
                            // setInterval(() => {
                            //     fetchTasks(selected)
                            // }, 300000)
                            setFetch(false)
                        }
                    }
                },
                (err) => {
                    console.log("TASK TYPE ER ", err);
                }
            )
            .catch((err) => {
                console.log("TASK TYPE ER", err);
            });
    };

    const getMoreData = () => {
        console.log('getMoreData scroll..', currentPage, totalPage, activeTab)
        if (currentPage === totalPage) {
            setHasMore(false);
            return;
        }
        setLoader(true)
        setShowingNextData(true)
        fetchPage(currentPage + 1)
    }

    const checkRestrictedAlarm = (taskData) => {
        let foundRestrictedAlrt = false
        for (let index = 0; index < taskData.length; index++) {
            const task = taskData[index];
            console.log('tasks for beep sound task', task)
            if (task && task.taskInput && task.taskInput.statusCode) {
                if (task.taskInput.statusCode == '65310' || task.taskInput.statusCode == '65311') {
                    if (task.taskStatus !== 'COMPLETED') {
                        foundRestrictedAlrt = true
                        break
                    }
                }
            }
        }
        console.log('tasks for beep sound UI', foundRestrictedAlrt)
        updateAlertBeepTasks(foundRestrictedAlrt)
    }

    const acknowledgeAllTaskHandler = () => {
        const res = axios
            .put(EndPoints.getConfig().acknowledgeAllTask,{}, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                    // Authorization:user.access_token
                }
            })
            .then(
                (res) => {
                    if (res.data) {
                        console.log("TASK UPDATE RES ", JSON.stringify(res.data));
                        let data = res.data;
                        if (data) {
                            onTaskAcknowledge()
                        }
                    }
                },
                (err) => {
                    console.log("TASK UPDATE ER ", err);
                }
            )
            .catch((err) => {
                console.log("TASK UPDATE ER", err);
            });
    }

    return (
        <div style={{ position: 'relative', height: '900px' }}>
            <div class="title-grid-list">
                <Title title="Incoming Alerts" type="Alerts" search={() => { }} />
                <div class="grid-list-view-icon" >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', alignContent: 'center', marginTop: '5px' }}>
                        <Button style={{ width: "30px", height: "30px", alignSelf: "center" }} onClick={() => fetchTasks(selected)}>
                            <RefreshRounded></RefreshRounded>
                        </Button>
                        {/* <div >
                            <ToggleButtonGroup
                                orientation="horizontal"
                                value={selectedDisplay}
                                exclusive
                                onChange={handleChange}
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="list" aria-label="list" size="small">
                                    <ViewListIcon />
                                </ToggleButton>
                                <ToggleButton value="module" aria-label="module" size="small">
                                    <ViewModuleIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div> */}
                    </div>
                </div>
            </div>
            <div class="title-grid-4">
                <div class="title">
                    <ul class="nav nav-pills m-t-12 m-b-12 m-l-20" id="pills-tab" role="tablist">
                        {Menuoptions.map((opt, id) => {
                            return (
                                <li class="tabs-pills m-r-10" key={opt.name + id}>
                                    <a
                                        class={selected === opt.value ? "pill-tabs active muli" : "pill-tabs muli"}
                                        id={opt.id}
                                        data-toggle="pill"
                                        href=''
                                        role="tab"
                                        aria-controls={opt.aria}
                                        aria-selected={selected === opt.value ? true : false}
                                        onClick={() => { fetchTasks(opt.value) }}
                                    >{opt.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div class="search">
                    <Button style={{ backgroundColor: "#ffb01f", color: "black" }} variant="container" onClick={acknowledgeAllTaskHandler}>Acknowledge All</Button>
                </div>
            </div>
            <div id="scrollableDivAlertt" style={selectedDisplay === 'list' ? {
                height: '770px', width: '97%', marginTop: '20px', marginLeft: '20px', marginRight: '20px',
                borderRadius: '14px',
                backgroundColor: "#363636",
                overflow: "auto"
            } : { height: '0px' }}>
                {
                    allTasks && allTasks.length > 0 ?
                        <InfiniteScroll
                            dataLength={allTasks.length}
                            next={getMoreData}
                            hasMore={hasMore}
                            loader={loading ? <div class='al-center'><p class='white'>Loading</p></div> : <div></div>}
                            scrollableTarget='scrollableDivAlertt'
                        >
                            {selectedDisplay === 'list' ? allTasks && allTasks.map(task => {
                                let compPath = taskType.get(task.taskType)
                                return (
                                    <TaskRenderer
                                        taskData={task}
                                        compPath={compPath}
                                        listType={selectedDisplay}
                                        onTaskAcknowledge={onTaskAcknowledge}
                                    />)
                            }) :
                                <div class="a2-grid m-t-15">
                                    {allTasks && allTasks.map(task => {
                                        let compPath = taskType.get(task.taskType)
                                        return (
                                            <TaskCardRenderer
                                                taskData={task}
                                                compPath={compPath}
                                                listType={selectedDisplay}
                                                onTaskAcknowledge={onTaskAcknowledge}
                                            />)
                                    })}
                                </div>}
                        </InfiniteScroll>
                        :
                        <div>
                            {allTasks && allTasks.length === 0 ?
                                <div
                                    class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                                    style={{ height: '445px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >{isSearch ? 'No match found' : ''}
                                </div>
                                : null}
                        </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, logs, train, task }) => {
    const { user } = auth;
    const { tasks, activeTaskCount } = task;
    const { alertsRefresh, taskRefresh, activeTab } = logs;
    const { trains, radioData } = train;
    return {
        user,
        alertsRefresh,
        taskRefresh,
        trains,
        radioData,
        tasks,
        activeTaskCount,
        activeTab
    };
};

export default connect(mapStateToProps, { getAllTasks, getActiveTaskCount, getAlerts, updateAlertTabOption, setRefresh, updateAlertBeepTasks })(IncomingTasks)
