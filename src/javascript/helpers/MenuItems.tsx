import { MenuItem } from '../components/MenuBar';
import {ContextItem} from '../components/ContextMenu';

import { rxConfig, setRxConfig } from './rxConfig';
import { setConfig } from 'react-hot-loader';

const { ipcRenderer, shell, remote, webFrame } = require('electron');
const {dialog, BrowserWindow, app} = remote;

var win = remote.getCurrentWindow();

const MenuItems = (themeType, config = null, platform = "windows") => {

    const isDark = () : Boolean => {
        
        if (themeType == 'dark') {
            return true;
        } else {
            return false;
        }
    }
    
    const isLight = () : Boolean => {
        
        if (themeType == 'light') {
            return true;
        } else {
            return false;
        }
    }
    
    const win = () : Array<MenuItem> => { 
        return [
            {
                title: "File",
                contextMenu: [
                    {
                        role: 'normal',
                        title: 'Exit',
                        icon: 'MdExitToApp',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().close();
                        }
                    }
                ] as Array<ContextItem>
            },
            {
                title: 'Edit',
                contextMenu: [
                    {
                        role: 'normal',
                        title: 'Cut',
                        shortcut: 'Ctrl+X',
                        icon: 'MdContentCut',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.cut();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Copy',
                        shortcut: 'Ctrl+C',
                        icon: 'MdContentCopy',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.copy();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Paste',
                        shortcut: 'Ctrl+V',
                        icon: 'MdContentPaste',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.paste();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Delete',
                        shortcut: '',
                        icon: 'MdDelete',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.delete();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Select All',
                        shortcut: 'Ctrl+A',
                        icon: 'MdSelectAll',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.selectAll();
                        }
                    }
                ] as Array<ContextItem>
            },
            {
                title: 'View',
                contextMenu: [
                    {
                        role: 'normal',
                        title: 'Reload',
                        shortcut: 'Ctrl+R',
                        icon: 'MdRefresh',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().reload();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Force Reload',
                        shortcut: 'Ctrl+Shift+R',
                        icon: 'MdReplay',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.reloadIgnoringCache();
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Toggle Developer Tools',
                        shortcut: 'Ctrl+Shift+I',
                        icon: 'MdExtension',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.toggleDevTools()
                        }
                    },
                    {
                        role: 'seperator',
                    },
                    {
                        role: 'submenu',
                        title: 'Appearance',
                        icon: 'MdBrightness3',
                        enabled: true,
                        contextMenu: [
                            {
                                role: 'normal',
                                title: 'Dark Theme',
                                icon: 'MdBrightnessLow',
                                enabled: true,
                                selected: isDark(),
                                action() { 
                                    let Config = Object.assign({}, config);
                                    Config['themeType'] = 'dark';
                                    setRxConfig(Config);
                                }
                            },
                            {
                                role: 'normal',
                                title: 'Light Theme',
                                icon: 'MdBrightness3',
                                enabled: true,
                                selected: isLight(),
                                action() { 
                                    let Config = Object.assign({}, config);
                                    Config['themeType'] = 'light';
                                    setRxConfig(Config);
                                }
                            },
                        ] as Array<ContextItem>
                    },
                    {
                        role: 'seperator',
                    },
                    {
                        role: 'normal',
                        title: 'Actual Size',
                        shortcut: 'Ctrl+0',
                        icon: 'MdZoomOutMap',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().webContents.setZoomFactor(1);
                            
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Zoom In',
                        shortcut: 'Ctrl+Shift+=',
                        icon: 'MdZoomIn',
                        enabled: true,
                        action() { 
                            const currentZoomLevel : any = webFrame.getZoomFactor();
                            remote.getCurrentWindow().webContents.setZoomFactor(currentZoomLevel + 0.2);
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Zoom Out',
                        shortcut: 'Ctrl+Shift+-',
                        icon: 'MdZoomOut',
                        enabled: true,
                        action() { 
                            const currentZoomLevel : any = webFrame.getZoomFactor();
                            remote.getCurrentWindow().webContents.setZoomFactor(currentZoomLevel - 0.2);
                        }
                    },
                    {
                        role: 'seperator'
                    },
                    {
                        role: 'normal',
                        title: 'Toggle Full Screen',
                        shortcut: 'F11',
                        icon: 'MdFullscreen',
                        enabled: true,
                        action() { 
                            remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
                        }
                    },
                ] as Array<ContextItem>
            },
            {
                title: 'Help',
                contextMenu: [
                    {
                        role: 'normal',
                        title: 'Official CB DLive Channel',
                        shortcut: '',
                        icon: 'GoLink',
                        enabled: true,
                        action() { 
                            shell.openExternal("https://dlive.tv/creativebuilds");
                        }
                    },
                    {
                        role: 'normal',
                        title: 'CreativeBuilds Discord',
                        shortcut: '',
                        icon: 'GoLink',
                        enabled: true,
                        action() { 
                            shell.openExternal("https://discord.gg/2DGaWDW");
                        }
                    },
                    {
                        role: 'normal',
                        title: 'Github Page',
                        shortcut: '',
                        icon: 'GoMarkGithub',
                        enabled: true,
                        action() { 
                            shell.openExternal("https://github.com/CreativeBuilds/creative-bot");
                        }
                    },
                    {
                        role: 'normal',
                        title: 'About App',
                        shortcut: '',
                        icon: 'MdHelpOutline',
                        enabled: true,
                        action() { 
                            let options = {
                                type: 'info',
                                title: 'About App',
                                message: 'About Dlive Chat Bot',
                                detail: `
                                Version: ${app.getVersion()}, 
                                Electron: ${process.versions.electron}, 
                                chrome: ${process.versions.chrome}, 
                                node: ${process.versions.node}, 
                                v8: ${process.versions.v8}, 
                                Developed By CreativeBuilds`
                            };
        
                            dialog.showMessageBox(options);
                        }
                    },
                ] as Array<ContextItem>
            }
        ] as Array<MenuItem>;
    }

    return win();
}

const menuItems_win = MenuItems;

export { MenuItems }