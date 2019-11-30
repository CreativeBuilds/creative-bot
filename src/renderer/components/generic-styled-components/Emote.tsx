import * as React from 'react';
import styled from 'styled-components';
import {
  PopupDialogBackground,
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupButtonWrapper,
  PopupDialogInputWrapper,
  PopupDialogInputInfo,
  PopupDialogInputName,
  PopupDialogTabWrapper,
  PopupDialogTabHeaderWrapper,
  PopupDialogTab,
  PopupDialogTabPage,
  PopupDialogInput
} from '../generic-styled-components/popupDialog';
import { FaShare, FaPlus, FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Emote } from '@/renderer/helpers/db/db';
import { rxEmotes } from '@/renderer/helpers/rxEmote';
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';

interface IStickerProps {
    frameHeight?: string;
    frameWidth?: string;
}

const StickerItem = styled.div`
    border-radius: 4px;
    display: block;
    position: relative;
    display: grid;

    img {
      max-height: ${(props: IStickerProps): string => 
        props.frameHeight ? props.frameHeight : '75px'};
      max-width: ${(props: IStickerProps): string => 
        props.frameWidth ? props.frameWidth : '100%'};
      border-radius: 4px;
      user-select: none;
    }
`;

const StickerCircleContainer = styled.div`
  position: absolute;
  display: flex;
  Width: 100%;
  height: 100%;
  vertical-align: middle;
  align-content: center;
  text-align: center;
  top: 0;
`;

const StickerShareCircle = styled.div`
      height: 36px;
      width: 36px;
      background-color: rgba(255,255,255,0.7);
      border-radius: 50%;
      margin: auto;
      display: flex;

      &:hover {
        cursor: pointer;
        background-color: rgba(180,180,180,0.9);
      }

      svg {
        stroke: #000000;
        fill: #000000;
        text-align: center;
        vertical-align: middle;
        margin: auto;
      }

      box-shadow: 1px 0px 5px 1px #000000
      z-index: 998;
`;

const DeleteCircleButton = styled.div`
      height: 20px;
      width: 20px;
      background-color: rgba(255,255,255,0.9);
      border-radius: 50%;
      margin-left: auto;
      display: flex;
      padding: 1px;

      &:hover {
        cursor: pointer;
        background-color: rgba(180,180,180,0.9);
      }

      svg {
        stroke: #f12154D1;
        fill: #f12154D1;
        text-align: center;
        vertical-align: middle;
        margin: auto;
      }

      box-shadow: 1px 0px 5px 1px #000000
      z-index: 999;
`;

export const EmoteItem = ({
    url,
    id,
    dliveId,
    icon = <FaPlus />,
    canDelete = false,
    hasBorder = false,
    height = '75px',
    width = '75px',
    onDelete = () => {},
    onClick = () => {}
  }: {
    url: string;
    id: string;
    dliveId: string;
    icon?: any;
    canDelete?: boolean;
    hasBorder?: boolean;
    height?: string;
    width?: string;
    onDelete?: () => void;
    onClick?: () => void;
  }) => {
  
    const [isHoveringOnSticker, setHoveringOnSticker] = React.useState<Boolean>(false);
  
    const stickerHoverStyle = (): HoverStyle => {
      var style: HoverStyle = new HoverStyle();
      style.hasBorder = hasBorder;
      style.borderColor = '#ffffff';
      style.borderWidth = '2px';
      style.borderType = 'solid';
      style.borderRadius = '4px';
      style.cursor = 'auto';
      return style;
    }
  
    return (
      <AdvancedDiv 
          hoverStyle={stickerHoverStyle()} 
          aStyle={{
              maxWidth: width,
              maxHeight: height,
              'margin': '5px',
              'display': 'inline-block'
          }}
          onHover={(e) => { setHoveringOnSticker(!!e); }}
          >
          <StickerItem frameWidth={width} frameHeight={height}>
            <img src={url} />
            {isHoveringOnSticker ?
            <StickerCircleContainer>
              <StickerShareCircle onClick={onClick}>
                {icon}
              </StickerShareCircle>
            </StickerCircleContainer>
            : null}
            {isHoveringOnSticker ?
                canDelete ?
                <StickerCircleContainer>
                    <DeleteCircleButton onClick={onDelete}>
                        <FaTimes />
                    </DeleteCircleButton>
                </StickerCircleContainer> 
                : null
            : null}
          </StickerItem>
        </AdvancedDiv>
    );
  };