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
import { accentColor } from '@/renderer/helpers/appearance';
import theme = require('styled-theming');

interface IStickerProps {
  frameHeight?: string;
  frameWidth?: string;
}

/**
 * @description shows a sticker
 */
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
  width: 100%;
  height: 100%;
  vertical-align: middle;
  align-content: center;
  text-align: center;
  top: 0;
`;

const StickerShareCircle = styled.div`
  height: 36px;
  width: 36px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  margin: auto;
  display: flex;

  &:hover {
    cursor: pointer;
    background-color: rgba(180, 180, 180, 0.9);
  }

  svg {
    stroke: #000000;
    fill: #000000;
    text-align: center;
    vertical-align: middle;
    margin: auto;
  }

  box-shadow: 1px 0px 5px 1px #000000;
  z-index: 998;
`;

const DeleteCircleButton = styled.div`
  height: 20px;
  width: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  margin-left: auto;
  display: flex;
  padding: 1px;

  &:hover {
    cursor: pointer;
    background-color: rgba(180, 180, 180, 0.9);
  }

  svg {
    stroke: #f12154d1;
    fill: #f12154d1;
    text-align: center;
    vertical-align: middle;
    margin: auto;
  }

  box-shadow: 1px 0px 5px 1px #000000;
  z-index: 999;
`;

export const EmoteAsTextItem = styled.div`
  display: inline-block;
  > div {
    margin-right: 10px;
  }

  svg {
    border-radius: 15px;
    padding: 3px;
    &:hover {
      cursor: pointer;
      fill: black;
      stroke: black;
      background-color: rgba(255,255,255, 74);
      border-radius: 15px;
      padding: 3px;
    }
  }

  svg, div {
    display: inline-block;
    vertical-align: middle;
  }
`;

interface IAnEmoteProps {
  width: number;
  height: number;
  borderColor: theme.ThemeSet;
  hideBorder?: boolean;
}

const AnEmote = styled.div`
  max-width: ${(props: IAnEmoteProps): string => `${props.width}px`};
  max-height: ${(props: IAnEmoteProps): string => `${props.height}px`};
  margin: 5px;
  display: inline-block;
  border-radius: 4px;
  border: 3px solid rgba(0, 0, 0, 0);
  cursor: auto;
  transition: border 0.15s ease-in-out;
  & > div > div {
    display: none;
  }

  &:hover {
    & > div > div {
      display: flex;
    }
    cursor: pointer;
    border: 3px solid
      ${(props: IAnEmoteProps) =>
        props.hideBorder ? 'rgba(0,0,0,0)' : props.borderColor};
  }
`;

export const EmoteItem = ({
  url,
  icon = <FaPlus />,
  canDelete = false,
  hideBorder = false,
  height = 75,
  width = 75,
  onDelete = () => {},
  onClick = () => {}
}: {
  url: string;
  id: string;
  dliveId: string;
  icon?: any;
  canDelete?: boolean;
  hideBorder?: boolean;
  height?: number;
  width?: number;
  onDelete?: () => void;
  onClick?: () => void;
}) => {
  return (
    <AnEmote
      height={height}
      width={width}
      borderColor={accentColor}
      hideBorder={hideBorder}
      id={'testerino'}>
      <StickerItem
        frameWidth={`${-6 + width}px`}
        frameHeight={`${-6 + height}px`}>
        <img src={url} />
        <StickerCircleContainer>
          <StickerShareCircle onClick={onClick}>{icon}</StickerShareCircle>
        </StickerCircleContainer>
        {canDelete ? (
          <StickerCircleContainer>
            <DeleteCircleButton onClick={onDelete}>
              <FaTimes />
            </DeleteCircleButton>
          </StickerCircleContainer>
        ) : null}
      </StickerItem>
    </AnEmote>
  );
};
