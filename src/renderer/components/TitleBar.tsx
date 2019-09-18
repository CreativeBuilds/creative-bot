import * as React from 'react';
import styled from 'styled-components';
const { remote } = require('electron');
import { Icon } from './generic-styled-components/Icon';
import { FaMinus, FaRegWindowMaximize, FaWindowMaximize, FaTimes, FaBug, FaAdjust } from 'react-icons/fa';

/**
 * @description Renders The Bar for the TitleBar
 */
const Bar = styled.div`
  height: 28px;
  width: 100%;
  user-select: none;
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  background-color: #ffffff59;
  z-index: 9999;
`;

/**
 * @description DraggableArea so that the window can be moved on and around the screen
 */
const DraggableArea = styled.div`
  height: 100%;
  width: calc(100% - 176px);
  -webkit-app-region: drag;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  z-index: 0;
`;

/**
 * @description Application Version Title for TitleBar
 */
const VersionTitle = styled.div`
    text-align: center;
    vertical-align: middle;
    color: #f9f9f9;
    display: inline-block;
    position: absolute;
    left: 20px;
    top: 3.2px;
    margin-top: auto;
    margin-bottom: auto;
`;

/**
 * @description Application Title for TitleBar
 */
const AppTitle = styled.div`
    text-align: center;
    vertical-align: middle;
    color: white;
    margin: auto;
    padding-left: 120px;
`;

/**
 * @description Container for Window Action Buttons
 */
const ActionButtonsContainer = styled.div`
    float: right;
    height: 100%;
    display: inline-flex;
`;

/**
 * @description Container for Window Action Buttons
 */
const ActionButtonContainer = styled.div`
    display: inline-flex;
    width: 42px;
    height: 100%;
    cursor: pointer;
    z-index: 9999;
    &:hover {
        background-color: #00000029;
    };
`;

/**
 * @description Button Optimized for Windows Actions
 */
const WindowActionButton = ({icon, onClick = function() {}} : {icon: Object, onClick?: () => void}) => {
    return(
        <ActionButtonContainer onClick={onClick}>
            <Icon style={{ margin: 'auto' }} color="#ffffff">
                {icon}
            </Icon>
        </ActionButtonContainer>
    );
}

/**
 * @description Custom TitleBar that replaces the default one that the OS Provided
 */
export const TitleBar = () => {

    /**
    * @description Toggle the Dev Tools from Electron in the current 
    */
    const showDevTools = () => {
        remote.getCurrentWindow().webContents.toggleDevTools();
    };

    /**
    * @description Allow user to minimize the current Window
    */
    const minimize = () => {
        remote.getCurrentWindow().minimize();
    };

    /**
    * @description Allow user to maximize the current Window
    */
    const maximize = () => {
        if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
        } else {
        remote.getCurrentWindow().maximize();
        }

        setMaximized(isMaximized());
    };

    /**
    * @description Checks if current window is maximized or not
    */
    const isMaximized = () => {
        return remote.getCurrentWindow().isMaximized();
    };

    /**
    * @description Gets maximized icon depending if unmaximized or maximized
    */
    const getMaximizedIcon = () => {
        return isMaximize ? (
            <FaWindowMaximize />
        ) : (
            <FaRegWindowMaximize />
        );
    };

    // Declared maximized values (ables us to change the icon when maximzed or not)
    const [isMaximize, setMaximized] =  React.useState(isMaximized());

    /**
    * @description Closes current window
    */
    const close = () => {
        remote.getCurrentWindow().close();
    };

    return(
        <Bar>
            <DraggableArea />
            <VersionTitle>2.0-canary</VersionTitle>
            <AppTitle>CreativeBot</AppTitle>
            <ActionButtonsContainer>
                { /* <WindowActionButton icon={<FaAdjust />}/> */ }
                <WindowActionButton icon={<FaBug />} onClick={() => showDevTools()}/>
                <WindowActionButton icon={<FaMinus />} onClick={() => minimize()}/>
                <WindowActionButton icon={getMaximizedIcon()} onClick={() => maximize()}/>
                <WindowActionButton icon={<FaTimes />} onClick={() => close()}/>
            </ActionButtonsContainer>
        </Bar>
    );
};