
import React from "react";
import HelpPointTaskListItem from "../../Alerts/helpPointTaskListItem";
import DefaultTascCardItem from "../../Alerts/defaultTaskCardItem";

const HelpPointTaskCardRender = (props) => {
    const { taskData, listType, onTaskAcknowledge } = props
    let modifiedData = {
        ...taskData.taskInput,
        fromId: taskData.taskInput.radioId,
        created: taskData.createdAt
    }
    //console.log("task data in taskcard", modifiedData)

    return (
        listType === 'list' ?
            <HelpPointTaskListItem
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

export default HelpPointTaskCardRender;
