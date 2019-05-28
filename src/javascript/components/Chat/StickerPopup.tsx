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
    const [emotes, setEmotes] = useState(Emotes);
    const [index, setIndex] = useState(0);
    const [page, setPage] = useState<Element>();

    useEffect(() => {
      let listener = rxEmotes.subscribe((data: any) => {
        setEmotes(data);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);

    let emoteSavedArray = _.orderBy(
      _.sortBy(Object.keys(emotes))
        .map(name => emotes[name])
    );

    const deleteEmote = (name) => {
        let Emotes = Object.assign({}, emotes);
        delete Emotes[name];
        setRxEmotes(Emotes);
        console.log(Emotes);

        emoteSavedArray = _.orderBy(
          _.sortBy(Object.keys(emotes))
            .map(name => emotes[name])
        );
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

    const onClick = (i) => {
      setIndex(i);
      setPage(segmentControlItems()[i].page);
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
                  { <div className={segStyles.segmentView}>{page}</div> }  
              </div>
            </div>
        </div>
      </div>
    );
  };

  export { StickerPopup }