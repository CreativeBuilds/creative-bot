import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, useComponentVisible } from '../../helpers';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';

import {
    MdHelpOutline,
    MdKeyboardArrowRight,
    MdDone,
    MdExitToApp,
    MdCardTravel,
    MdCloudDownload,
    MdCloudUpload,
    MdContentCut,
    MdContentCopy,
    MdContentPaste,
    MdDelete,
    MdSelectAll,
    MdRefresh,
    MdReplay,
    MdExtension,
    MdZoomOutMap,
    MdZoomIn,
    MdZoomOut,
    MdBrightnessLow,
    MdBrightness3,
    MdFullscreen,
    MdClose
  } from 'react-icons/md';
import { GoMarkGithub, GoLink } from 'react-icons/go';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

interface ContextItem {
  role: String;
  icon?: Object;
  title?: String;
  shortcut?: String;
  selected?: Boolean;
  action?: () => void;
  enabled: Boolean;
  contextMenu?: Array<ContextItem>;
}

interface ContextMenu {
  isOpen?: Boolean;
  isSubMenu?: Boolean;
  stateTheme: any;
  onClickedOutside?: () => void;
  contextItems: Array<ContextItem>;
}

const ContextMenu = ({
  contextItems,
  isOpen = false,
  stateTheme,
  onClickedOutside,
  isSubMenu = false
}: ContextMenu) => {
  const [opened, setOpened] = useState<Boolean>(isOpen);
  const [show, showMenu] = useState<Boolean>(false);
  const [config, setConfig] = useState<any>(null);

  const {
    ref,
    isComponentVisible,
    setIsComponentVisible
  } = useComponentVisible(false);

  return (
    <div
      style={Object.assign({}, isSubMenu ? stateTheme.contextMenu.content.submenu : null, stateTheme.contextMenu)}
      onClick={() => onClickedOutside()}
    >
      <ul
        style={Object.assign({}, stateTheme.base.quatrnaryBackground, stateTheme.contextMenu.content)}
      >
        {contextItems.map(i => (
          <ContextMenuItem stateTheme={stateTheme} contextItem={i} />
        ))}
      </ul>
    </div>
  );
};

interface ContextMenuItem {
    stateTheme: any;
    contextItem: ContextItem;
  }
  
  const ContextMenuItem = ({ contextItem, stateTheme }: ContextMenuItem) => {
    const [show, showMenu] = useState<Boolean>(false);
    const [isChecked, setChecked] = useState<Boolean>(contextItem.selected);
    const [config, setConfig] = useState<any>(null);
  
    const {
      ref,
      isComponentVisible,
      setIsComponentVisible
    } = useComponentVisible(show);
  
    const getIconComponent = name => {
      let map = {
        MdExitToApp: <MdExitToApp style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdContentCut: <MdContentCut style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdContentCopy: <MdContentCopy style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdContentPaste: <MdContentPaste style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdDelete: <MdDelete style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdSelectAll: <MdSelectAll style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdRefresh: <MdRefresh style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdReplay: <MdReplay style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdExtension: <MdExtension style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdBrightness3: <MdBrightness3 style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdBrightnessLow: <MdBrightnessLow style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdZoomOutMap: <MdZoomOutMap style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdZoomIn: <MdZoomIn style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdZoomOut: <MdZoomOut style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdFullscreen: <MdFullscreen style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        GoMarkGithub: <GoMarkGithub style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        GoLink: <GoLink style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdHelpOutline: <MdHelpOutline style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdCardTravel: <MdCardTravel style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdCloudDownload: <MdCloudDownload style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />,
        MdCloudUpload: <MdCloudUpload style={stateTheme.contextMenu.item.content.iconContainer.icon.svg} />
      };
      return map[name];
    };
  
    const isEnabled = () => {
      if (contextItem.enabled) {
        return true;
      } else {
        return false;
      }
    };
  
    const isSeperator = () => {
      if (contextItem.role.toLowerCase() == 'seperator') {
        return true;
      } else {
        return false;
      }
    };
  
    const getMenuItemType = () => {
      if (contextItem.role.toLowerCase() == 'normal') {
        return (
          <div style={stateTheme.contextMenu.item.container}>
            <div style={stateTheme.contextMenu.item.content}>
              <div style={stateTheme.contextMenu.item.content.iconContainer}>
                {isChecked ? (
                  <div style={stateTheme.contextMenu.item.content.iconContainer.checkedIcon}>
                    <MdDone style={stateTheme.contextMenu.item.content.iconContainer.checkedIcon.svg} />
                  </div>
                ) : null}
                <div style={stateTheme.contextMenu.item.content.iconContainer.icon}>
                  {getIconComponent(contextItem.icon)}
                </div>
              </div>
              <div style={stateTheme.contextMenu.item.content.title}>
                <span>{contextItem.title}</span>
              </div>
              <div style={stateTheme.contextMenu.item.content.shortcut}>
                <span>{contextItem.shortcut}</span>
              </div>
            </div>
          </div>
        );
      } else if (contextItem.role.toLowerCase() == 'submenu') {
        return (
          <div
            style={stateTheme.contextMenu.item.container}
            onMouseOver={() => setIsComponentVisible(true)}
            onMouseLeave={() => setIsComponentVisible(false)}
          >
            <div style={stateTheme.contextMenu.item.content}>
              <div style={stateTheme.contextMenu.item.content.iconContainer}>
                <div style={stateTheme.contextMenu.item.content.iconContainer.icon}>
                  {getIconComponent(contextItem.icon)}
                </div>
              </div>
              <div style={stateTheme.contextMenu.item.content.title}>
                <span>{contextItem.title}</span>
              </div>
              <MdKeyboardArrowRight style={Object.assign({}, stateTheme.contextMenu.item.content.arrow.svg, stateTheme.contextMenu.item.content.arrow)} />
            </div>
            <div style={stateTheme.contextMenu.item.container.submenu}>
              {isComponentVisible && (
                <ContextMenu
                  isSubMenu={true}
                  stateTheme={stateTheme}
                  contextItems={contextItem.contextMenu}
                  onClickedOutside={() => setIsComponentVisible(false)}
                />
              )}
            </div>
          </div>
        );
      }
    };
  
    return (
      <li
        style={Object.assign({}, !isEnabled() ? stateTheme.contextMenu.item.inactive : null, stateTheme.contextMenu.item)}
        onClick={() => contextItem.action()}
      >
        {isSeperator() ? (
          <div>
            <hr style={stateTheme.contextMenu.item.seperator}/>
          </div>
        ) : (
          getMenuItemType()
        )}
      </li>
    );
};
  

export { ContextMenu, ContextItem };