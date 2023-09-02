module.exports.showDuration = (startTime,endTime)=>{
    let duration =  Math.abs(Date.parse(startTime)-Date.parse(endTime))
    return duration ?  new Date(duration).toGMTString().substr(17,8) : "00:00:00"
}

module.exports.durationInSeconds= (startTime,endTime)=>{
    return Math.abs(Date.parse(startTime)-Date.parse(endTime))/1000;
}
module.exports.showTime = (time)=>{
    if(time){
        // let timestamp = Date.parse(time);
        return new Date(time).toLocaleString();
    }
    return "";
}

module.exports.changeBoolValue = (value)=>{
    if(value=='1')
    return "Yes";
    return "No";
}