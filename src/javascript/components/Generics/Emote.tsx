import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { MdClose } from 'react-icons/md';

import { 
  AdvancedDiv,
  BubbleButton
 } from './CreativeUI';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

interface Emote {
  stickerDLiveId: string;
  stickerUrl: string;
  stateTheme: any;
  canDelete?: Boolean;
  onDelete?: () => void;
}

const Emote = ({ stickerUrl, stickerDLiveId, stateTheme, canDelete = false, onDelete} : Emote) => {

  const [isHovering, setHovering] = useState<Boolean>(false);

  const sendMessage = () => {
    ipcRenderer.send('sendmessage', { from: 'bot', message: stickerDLiveId });
  };

  return (
    <AdvancedDiv 
      aStyle={{
        'max-width': '100px',
        'max-height': '100px',
      }}
      style={stateTheme.items.emote.container}
      onHover={(e) => { setHovering(e); }}
      hoverStyle={Object.assign({}, theme.globals.accentBorderColor, stateTheme.items.emote.hover)}>
        <div>
          {canDelete ? isHovering ? <BubbleButton icon={<MdClose />} hoverTextColor={'red'} stateTheme={stateTheme} onClick={onDelete} /> : null : null}
          <img style={stateTheme.items.emote} src={stickerUrl} onClick={sendMessage}/>
        </div>
    </AdvancedDiv>
  );
};

export { Emote };