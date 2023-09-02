import React from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Menu } from 'semantic-ui-react'
export default function RenderMenu (props){
    return (
        <Menu vertical color={'#30368f'} borderless={true}>
            <Dropdown item text='Call' inverted>
                <Dropdown.Menu>
                    <Dropdown.Item 
                        name='hookcall'
                        active={props.activeItem === 'hookcall'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-phone-incoming context-icon"></i> Hook Call</a></Dropdown.Item>
                    <Dropdown.Item
                        name='directcall'
                        active={props.activeItem === 'directcall'}
                        onClick={props.handleItemClick}
                        ><a ><i class="feather icon-phone-forwarded context-icon"></i> Direct Call</a></Dropdown.Item>
                    <Dropdown.Item
                        name='broadcastcall'
                        active={props.activeItem === 'broadcastcall'}
                        onClick={props.handleItemClick}
                        ><a ><i class="feather icon-phone context-icon"></i> Broadcast Call</a></Dropdown.Item>
                    <Dropdown.Item
                        name='duplexcall'
                        active={props.activeItem === 'duplexcall'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-phone-call context-icon"></i> Duplex Call</a></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown item text='Message'>
                <Dropdown.Menu>
                    <Dropdown.Item
                        name='statuessds'
                        active={props.activeItem === 'statuessds'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-mail context-icon"></i> Status SDS</a></Dropdown.Item>
                    <Dropdown.Item
                        name='predefinedsds'
                        active={props.activeItem === 'predefinedsds'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-mail context-icon"></i> Predefined SDS</a></Dropdown.Item>
                    <Dropdown.Item
                        name='textsds'
                        active={props.activeItem === 'textsds'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-mail context-icon"></i> Text SDS</a></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown item text='Public Announcement'>
                <Dropdown.Menu>
                    <Dropdown.Item
                        name='custompa'
                        active={props.activeItem === 'custompa'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-phone-incoming context-icon"></i> Custom PA</a></Dropdown.Item>
                    <Dropdown.Item name='predefinedpa'
                        active={props.activeItem === 'predefinedpa'}
                        onClick={props.handleItemClick}
                        ><a><i class="feather icon-phone-forwarded context-icon"></i> Predefined PA</a></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
                name='messages'
                active={props.activeItem === 'messages'}
                onClick={props.handleItemClick}
            >
                <a><i class="feather icon-alert-triangle context-icon yellow"></i> Send Alerts</a>
            </Menu.Item>
            <Menu.Item
                name='emergency'
                active={props.activeItem === 'emergency'}
                onClick={props.handleItemClick}
            >
                <a>
                    <i class="feather icon-alert-circle context-icon red-5"></i>
                    <span class="red-4">Emergency</span>
                </a>
            </Menu.Item>
            <Menu.Item
                name='subscriber'
                active={props.activeItem === 'subscriber'}
                onClick={props.handleItemClick}
            >
                <a><i class="feather icon-user-check context-icon lime-4"></i>Subscriber Details</a>
            </Menu.Item>
            <Menu.Item
                name='addremove'
                active={props.activeItem === 'addremove'}
                onClick={props.handleItemClick}
            >
                <a><i class="feather icon-star context-icon yellow"></i> Add/Remove Favourites</a>
            </Menu.Item>
        </Menu>
    )
}
