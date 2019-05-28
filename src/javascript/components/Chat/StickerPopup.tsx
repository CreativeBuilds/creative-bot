import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace, MdSentimentDissatisfied } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { rxEmotes, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { SegmentControlItem } from '../SegmentControl/SegmentControlItem';
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
  Emotes?: {}
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
    const [savedemotes, setSavedEmotes] = useState(Emotes);
    const [globalemotes, setGlobalEmotes] = useState({});
    const [channelemotes, setChannelEmotes] = useState({});
    const [favouritesemotes, setFavouritesEmotes] = useState({});
    const [allemotes, setAllEmotes] = useState({});
    const [index, setIndex] = useState(0);
    const [noStickerErrorMsg, setNoStickerMsg] = useState<Array<String>>(['No Stickers', 'No Favourite Stickers', 'No Channel Stickers', 'No Global Stickers', 'No Saved Stickers'])

    useEffect(() => {
      let listener = rxEmotes.subscribe((data: any) => {
        setSavedEmotes(data);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);

    let emoteSavedArray = _.orderBy(
      _.sortBy(Object.keys(savedemotes))
        .map(name => savedemotes[name])
    );

    let emoteGlobalArray = _.orderBy(
      _.sortBy(Object.keys(globalemotes))
        .map(name => globalemotes[name])
    );

    let emoteChannelArray = _.orderBy(
      _.sortBy(Object.keys(channelemotes))
        .map(name => channelemotes[name])
    );

    let emoteFavouritesArray = _.orderBy(
      _.sortBy(Object.keys(favouritesemotes))
        .map(name => favouritesemotes[name])
    );

    let emoteAllArray = _.orderBy(
      _.sortBy(Object.keys(allemotes))
        .map(name => allemotes[name])
    );

    const deleteEmote = (name) => {
        let Emotes = Object.assign({}, savedemotes);
        delete Emotes[name];
        setRxEmotes(Emotes);
        console.log(Emotes);

        setEmotesList(emoteSavedArray);
    };

    const segmentControlItems = () => {
        var items : Array<SegmentControlSource> = [
            {
                id: 0,
                name: "All",
                page: <div className={styles.gridView}>
                  {emoteSavedArray.length > 0 ? emoteSavedArray.map(i => <Emote stickerDLiveId={i.dliveid} stickerUrl={i.url}/>) : 
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>No Stickers</h3>
                  </div>
                  }
                </div>
            },
            {
                id: 1,
                name: "Favourites",
                page: <div className={styles.gridView}>
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>No Favourites Stickers</h3>
                  </div>
                </div>
            },
            {
                id: 2,
                name: "Channel",
                page: <div className={styles.gridView}>
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>No Channel Stickers</h3>
                  </div>
                </div>
            },
            {
                id: 3,
                name: "Global",
                page: <div className={styles.gridView}>
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>No Global Stickers</h3>
                  </div>
                </div>
            },
            {
                id: 4,
                name: "Saved",
                page: <div className={styles.gridView}>
                  {emoteSavedArray.length > 0 ? emoteSavedArray.map((i, index) => <Emote stickerDLiveId={i.dliveid} stickerUrl={i.url} canDelete={true} onDelete={() => deleteEmote(i.id)} />) : 
                  <div className={styles.noStickers}>
                    <MdSentimentDissatisfied />
                    <h3>No Stickers</h3>
                  </div>
                  }
                </div>
            },
        ]

        return items;
    }

    const [page, setPage] = useState<Element>(segmentControlItems()[0].page);
    const [emotesList, setEmotesList] = useState(emoteSavedArray);

    const onClick = (i) => {
      setIndex(i);
      setPage(segmentControlItems()[i].page);

      switch (i) {
        case 0:
            setEmotesList(emoteSavedArray);
            break;
        case 1:
            setEmotesList(emoteFavouritesArray);
            break;
        case 2:
            setEmotesList(emoteChannelArray);
            break;
        case 3:
            setEmotesList(emoteGlobalArray);
            break;
        case 4:
            setEmotesList(emoteSavedArray);
            break;     
      }
    }
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <h2>Stickers</h2>
        <div className={`${styles.stickersPopup}`}>
            <div className={segStyles.segmentControl}>
              <div className={segStyles.segmentHeader} style={stateTheme.segmentControlHeader}>
                  {segmentControlItems().map(i => <SegmentControlItem id={i.name} title={i.name} defaultValue={"All"} onClick={() => onClick(i.id)}/>)}
              </div>
              <div className={segStyles.segmentBody}>
                  <div className={segStyles.segmentView}>
                    <div className={styles.gridView}>
                        {emotesList.length > 0 ? emotesList.map(i => <Emote stickerDLiveId={i.dliveid} stickerUrl={i.url} canDelete={index == 4 ? true : false} onDelete={() => deleteEmote(i.id)} />) : 
                        <div className={styles.noStickers}>
                          <MdSentimentDissatisfied />
                          <h3>{noStickerErrorMsg[index]}</h3>
                        </div>
                        }
                      </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
    );
  };

  export { StickerPopup }