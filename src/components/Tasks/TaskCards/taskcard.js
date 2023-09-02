import React from "react";
import moment from 'moment'
import AlertList from "../../Alerts/AlertList";
import { AlertCard } from "../../Alerts";
import DefaultTaskListItem from "../../Alerts/defaultTaskListItem";
import DefaultTascCardItem from "../../Alerts/defaultTaskCardItem";
import HelpPointTaskListItem from "../../Alerts/helpPointTaskListItem";

const TaskCard = (props) => {
    const { taskData, listType, onTaskAcknowledge } = props
    let modifiedData = {
        ...taskData.taskInput,
        fromId: taskData.taskInput.radioId,
        created: taskData.createdAt
    }
    console.log("task data m in taskcard", modifiedData)

    return (
        listType === 'list' ?
            <DefaultTaskListItem
                id={'rt56'}
                data={modifiedData}
                taskData={taskData}
                onTaskAcknowledge={onTaskAcknowledge}
                key={taskData.taskInput.created}
            />
            :
            <DefaultTascCardItem
                id={'rt56'}
                data={modifiedData}
                taskData={taskData}
                onTaskAcknowledge={onTaskAcknowledge}
                key={taskData.taskInput.created}
            />
    );
}

export default TaskCard;
