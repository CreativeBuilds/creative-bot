import * as React from 'react';
import { useState } from 'react';
import * as _ from 'lodash';
let { setRxQuotes } = require('../../helpers/rxQuotes');

const AddQuotePopup = ({
    styles,
    closeCurrentPopup,
    stateTheme,
    quotes = {}
  }) => {
    const [quote, setQuote] = useState<string>('');
    const [quoteBy, setQuoteBy] = useState<string>('');
    const [event, setEvent] = useState<string>('');
    const [date, setDate] = useState<string>('');
  
    const saveToDB = () => {

        if (quote.length === 0) return;
        let Quotes = Object.assign({}, quotes);

        Quotes['quotes'].push({
          quote,
          quoteBy,
          event,
          date
        }) as Array<Object>;

        setRxQuotes(Quotes);
    };
  
    const save = () => {
      saveToDB();
      closeCurrentPopup();
    };
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <h2>Add a Quote</h2>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quote</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setQuote(e.target.value);
            }}
            value={quote}
            />
        </div>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quoted By</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setQuoteBy(e.target.value);
            }}
            value={quoteBy}
            />
        </div>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Event (Optional)</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setEvent(e.target.value);
            }}
            value={event}
            />
        </div>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Date Quoted (Optional)</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setDate(e.target.value);
            }}
            value={date}
            />
        </div>
        <div
          className={styles.submit}
          onClick={save}
          style={{
            backgroundColor: stateTheme.menu.backgroundColor,
            color: stateTheme.menu.color,
            borderColor: stateTheme.menu.backgroundColor
          }}
        >
          CREATE
        </div>
      </div>
    );
  };
  
  export { AddQuotePopup };
  