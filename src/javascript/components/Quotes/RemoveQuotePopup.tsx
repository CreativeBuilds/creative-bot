import * as React from 'react';
import { useState } from 'react';
import { filter, first } from 'rxjs/operators';
let { setRxQuotes, rxQuotes } = require('../../helpers/rxQuotes');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const RemoveQuotePopup = ({
  quote,
  styles,
  closeCurrentPopup,
  stateTheme,
  nth,
  quotes
}) => {
  let name = quote.quote;

  const saveToDB = () => {
    if (name.length === 0) return;
    let Quotes = Object.assign({}, quotes);
    Quotes['quotes'].splice((nth - 1), 1);;
    setRxQuotes(Quotes);
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.remove_text}>
        You're about to delete this quote! Are you sure you want to do that?
      </div>
      <div
        className={styles.submit}
        onClick={() => {
          saveToDB();
          closeCurrentPopup();
        }}
      >
        YES
      </div>
    </div>
  );
};

export { RemoveQuotePopup };
