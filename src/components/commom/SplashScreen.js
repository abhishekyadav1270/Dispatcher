import React, { useEffect } from 'react'
import './style.css';

const SplashScreen = (props) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
    }, [])

    return (
    <div class="backgsplash">
        <div>
            <div class="splash-img">
                <div id="wave">
                    <div style={{ width:'180px',height:'20px'}}>
                        <span class="dotanim"></span>
                        <span class="dotanim"></span>
                        <span class="dotanim"></span>
                        <span class="dotanim"></span>
                        <span class="dotanim"></span>
                    </div>
                    <p style={{ width:'180px',height:'20px', padding:'8px'}}>Loading...</p>
                </div>
                <div>
                    <img class='splash-img-style' src="/assets/images/splashscreen.svg"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SplashScreen