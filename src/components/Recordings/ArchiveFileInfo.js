import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@material-ui/core';
import { EndPoints } from '../../MCXclient/endpoints';
import axios from 'axios';
import './player.css'

const ArchiveFileInfo = () => {
    const [archiveFileData, setArchiveFileData] = useState([]);

    useEffect(() => {
        axios.get(EndPoints.getConfig().archiveFile)
            .then((res) => {
                if (res.data) {
                    console.log("GetArchivedata :", res.data);
                    setArchiveFileData(res.data);
                }
            })
            .catch((err) => {
                console.log("error in fetching Archive file event--", err);
            })
    }, []);

    const downloadButton = (fileName) => {
        console.log("DownloadData :", fileName);
        let hiddenElement = document.createElement('a');
        hiddenElement.href = `${EndPoints.getConfig().exportArchiveFile}?fileName=${fileName}`;
        hiddenElement.target = '_blank';
        // hiddenElement.download = 'ActivityLog.csv';
        hiddenElement.click();
    }

    return (
        <div className='w-100'>
            <div className="archiveTable-row-grid-head">
                <div class="archive-tb-name">
                    <span>Available Archives</span>
                </div>
                <div class="archive-tb-icon ">
                </div>
            </div>
            <div style={{ height: "30vh", overflowY: "scroll" }}>
                {archiveFileData && archiveFileData.map((data, idx) => {
                    return (
                        <div key={idx} className="archiveTable-row-grid">
                            <div class="archive-tb-name">
                                <Typography>{data}</Typography>
                            </div>
                            <div class="archive-tb-icon">
                                <button
                                    className="sq-icon-btn in-blc m-r-5 wx32"
                                    onClick={() => downloadButton(data)}
                                >
                                    <i class="feather icon-arrow-down-circle"></i>
                                </button>

                            </div>
                        </div>
                    );
                }
                )}
            </div>
        </div>
    )
}

export default ArchiveFileInfo;