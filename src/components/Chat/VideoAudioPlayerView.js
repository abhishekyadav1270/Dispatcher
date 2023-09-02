import * as React from "react";

export const VideoAudioPlayerView = (props) => {
    const { msgType, fileId, msgText } = props

    const getDownloadLink = () => {
        let filePath = `https://${global.config.ipConfig.dispatcherHost}:${global.config.ipConfig.dispatcherServerPort}/uploads/`
        return filePath
    }

    let streamUrl = getDownloadLink() + msgText
    console.log('btn click..downloadUrl..',streamUrl)

    return (
        <div className="player-view">
            {
                msgType === 'image' ?
                    (
                        <div class="box box1"><img src={streamUrl}/></div>
                    ) :
                    msgType === 'video' ?
                        (
                            <video controls height={'90%'} width={'90%'}>
                                <source src={streamUrl} />
                            </video>
                        ) :
                        (
                            <audio controls>
                                <source src={streamUrl} />
                            </audio>
                        )

            }
        </div>
    )
}

export default VideoAudioPlayerView