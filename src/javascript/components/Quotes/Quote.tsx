import * as React from 'react';
import { useState } from 'react';

import { UpdateQuotePopup } from './UpdateQuotePopup';
import { RemoveQuotePopup } from './RemoveQuotePopup';

import { WidgetButton } from '../Generics/Button';

import { MdModeEdit, MdEdit, MdDelete, MdRemoveRedEye } from 'react-icons/md';
let { setRxLists } = require('../../helpers/rxLists');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Quote = ({
    styles,
    quote,
    nth,
    stateTheme,
    addPopup,
    closeCurrentPopup,
    quotes
  }) => {

    const updateQuotePopup = quote => {
      addPopup(
        <UpdateQuotePopup
          quote={quote}
          styles={styles}
          closeCurrentPopup={closeCurrentPopup}
          stateTheme={stateTheme}
          nth={nth}
          quotes={quotes}
        />
      );
    }

    const removeQuotePopup = quote => {
        addPopup(
          <RemoveQuotePopup
            quote={quote}
            styles={styles}
            closeCurrentPopup={closeCurrentPopup}
            stateTheme={stateTheme}
            nth={nth}
            quotes={quotes}
          />
        );
      };

    return (
        <div className={styles.user} style={Object.assign(
          {},
          stateTheme.cell.normal,
          nth % 2 ? stateTheme.cell.alternate : { }
        )}>
            <div className={styles.toggle_wrappers}>
                <div className={styles.id}>{quote.quoteId}{' '}
                <WidgetButton 
                  icon={<MdModeEdit />} 
                  stateTheme={stateTheme} 
                  onClick={() => {
                    updateQuotePopup(quote);
                  }}/>
            </div>
            <div className={styles.quote}>{quote.quote}</div>
            <div className={styles.quoteBy}>{quote.quoteBy}</div>
            <div className={styles.event}>{quote.event}</div>
            <div className={styles.date}>{quote.date}</div>
            <div className={styles.spacer} />
            <div className={styles.modded}>
                    <WidgetButton 
                      icon={<MdDelete />} 
                      stateTheme={stateTheme} 
                      onClick={() => {
                        removeQuotePopup(quote);
                      }}/>
                </div>
            </div>
        </div>
    );
}

export { Quote }