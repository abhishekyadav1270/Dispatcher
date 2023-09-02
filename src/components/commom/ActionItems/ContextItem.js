import React, { } from 'react'
import { Item } from 'react-contexify';

const ContextItem =(props)=>{
    const { submenu, iconClass, text, onClick,Style }=props;
    return(
        //CUSTOM DIV
        <div class={submenu?'':'context-item1 muli'} style={Style?Style:{}} onClick={onClick}>
            <a class='muli'>
                <i class={'context-icon feather '+iconClass}></i>
                {text==='Emergency'?
                <span class="red-4 muli">{text}</span>:
                text}
            </a>
        </div>
        //REACT CONTEXIFY
        // <Item className={submenu?'':'context-menu-item'} onClick={onClick}>
        //     <a class='muli'>
        //         <i class={'context-icon feather '+iconClass}></i>
        //         {text==='Emergency'?
        //         <span class="red-4 muli">{text}</span>:
        //         text}
        //     </a>
        // </Item>
    )
}

export default ContextItem