import React from "react";
const TaskRenderer = (props) => {
    const { taskData, compPath, listType, onTaskAcknowledge } = props
    console.log("complete path", `../${compPath}`)
    if (compPath) {
        const Card = require(`../${compPath}`).default
        //console.log("complete path js", Card)
        return (
            <Card taskData={taskData} listType={listType} onTaskAcknowledge={onTaskAcknowledge}></Card>
        )
    }
    else {
        return (
            <dev></dev>
        )
    }
}

export default TaskRenderer;
