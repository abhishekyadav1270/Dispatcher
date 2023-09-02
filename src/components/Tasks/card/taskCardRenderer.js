import React from "react";
const TaskCardRenderer = (props) => {
    const { taskData, compPath, listType, onTaskAcknowledge } = props
    if (compPath) {
        const Card = require(`../${compPath}`).default
        return (
            <Card taskData={taskData} listType={listType} onTaskAcknowledge={onTaskAcknowledge}></Card>
        );
    }
    else {
        return (
            <dev />
        )
    }
}

export default TaskCardRenderer;
