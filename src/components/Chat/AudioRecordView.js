import useRecorder from "./useRecorder";
import * as React from "react";
import { Button } from "react-bootstrap";

export const AudioRecordView = (props) => {
    let [audioURL, audioBlob, isRecording, startRecording, stopRecording] = useRecorder();

    const shareRecording = () => {
        if (audioBlob) {
            props.shareRecording(audioBlob)
        }
    }

    return (
        <div>
            <audio src={audioURL} controls />
            <div className="audio-btn-view">
                <div className="audio-btn">
                    <Button onClick={startRecording} disabled={isRecording}>
                        start recording
                    </Button>
                </div>
                <div className="audio-btn">
                    <Button onClick={stopRecording} disabled={!isRecording}>
                        stop recording
                    </Button>
                </div>
                <div className="audio-btn">
                    <Button variant="secondary" onClick={shareRecording} disabled={audioBlob === null ? true : false}>
                        share recording
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AudioRecordView