import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { theme, ThemeContext } from '../../helpers';
import {
  MdSend,
  MdPerson,
  MdMood,
  MdFace,
  MdSentimentDissatisfied
} from 'react-icons/md';

import { Message } from './Message';
import { firebaseEmotes$, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { SegmentControlItem } from '../SegmentControl/SegmentControlItem';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

import { Emote } from './Emote';
import { string } from 'prop-types';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Chat.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
  styles: any;
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  Emotes?: {};
}

const StickerPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  Emotes = {}
}: popup) => {
  const [name, setName] = useState<string>('');
  const [toggle, setToggle] = useState<string>('name');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [helperText, SetHelperText] = useState(text);
  const [error, SetError] = useState(false);
  const [config, setConfig] = useState(Config);
  const [emotesList, setEmotesList] = useState([]);
  const [savedemotes, setSavedEmotes] = useState(Emotes);
  const [globalemotes, setGlobalEmotes] = useState({});
  const [channelemotes, setChannelEmotes] = useState({});
  const [favouritesemotes, setFavouritesEmotes] = useState({});
  const [allemotes, setAllEmotes] = useState({});
  const [index, setIndex] = useState(0);
  const [noStickerErrorMsg, setNoStickerMsg] = useState<Array<String>>([
    'No Stickers',
    'No Favourite Stickers',
    'No Channel Stickers',
    'No Global Stickers',
    'No Saved Stickers'
  ]);

  let emoteSavedArray = _.orderBy(
    _.sortBy(Object.keys(savedemotes)).map(name => savedemotes[name])
  );

  let emoteGlobalArray = _.orderBy(
    _.sortBy(Object.keys(globalemotes)).map(name => globalemotes[name])
  );

  let emoteChannelArray = _.orderBy(
    _.sortBy(Object.keys(channelemotes)).map(name => channelemotes[name])
  );

  let emoteFavouritesArray = _.orderBy(
    _.sortBy(Object.keys(favouritesemotes)).map(name => favouritesemotes[name])
  );

  let emoteAllArray = _.orderBy(
    _.sortBy(Object.keys(allemotes)).map(name => allemotes[name])
  );

  const deleteEmote = id => {
    let Emotes = Object.assign({}, savedemotes);
    delete Emotes[id];
    setRxEmotes(Emotes);
    setEmotesList(
      _.orderBy(_.sortBy(Object.keys(Emotes)).map(name => Emotes[name]))
    );
  };

  useEffect(() => {
    let listener = firebaseEmotes$.subscribe((data: any) => {
      setSavedEmotes(data);
      setEmotesList(
        _.orderBy(_.sortBy(Object.keys(data)).map(name => data[name]))
      );
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const segmentControlItems = () => {
    var items: Array<SegmentControlSource> = [
      {
        id: 0,
        name: 'All'
      },
      /*{
                id: 1,
                name: "Favourites"
            },
            {
                id: 2,
                name: "Channel"
            },
            {
                id: 3,
                name: "Global"
            },*/
      {
        id: 1,
        name: 'Saved'
      }
    ];

    return items;
  };

  const [page, setPage] = useState<Element>(segmentControlItems()[0].page);

  const onClick = i => {
    setIndex(i);
    setPage(segmentControlItems()[i].page);

    switch (i) {
      case 0:
        setEmotesList(emoteSavedArray);
        break;
      /*case 1:
            setEmotesList(emoteFavouritesArray);
            break;
        case 2:
            setEmotesList(emoteChannelArray);
            break;
        case 3:
            setEmotesList(emoteGlobalArray);
            break;*/
      case 1:
        setEmotesList(emoteSavedArray);
        break;
    }
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Stickers</h2>
      <div className={`${styles.stickersPopup}`}>
        <div className={segStyles.segmentControl}>
          <div
            className={segStyles.segmentHeader}
            style={stateTheme.base.background}
          >
            {segmentControlItems().map(i => (
              <SegmentControlItem
                id={i.name}
                title={i.name as string}
                defaultValue={'All'}
                onClick={() => onClick(i.id)}
              />
            ))}
          </div>
          <div className={segStyles.segmentBody}>
            <div className={segStyles.segmentView}>
              <div className={styles.gridView}>
                {emotesList.length > 0 ? (
                  emotesList.map(i => (
                    <Emote
                      stickerDLiveId={i.dliveid}
                      stickerUrl={i.url}
                      canDelete={index == 1 ? true : false}
                      onDelete={() => deleteEmote(i.id)}
                    />
                  ))
                ) : (
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>{noStickerErrorMsg[index]}</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StickerPopup };
