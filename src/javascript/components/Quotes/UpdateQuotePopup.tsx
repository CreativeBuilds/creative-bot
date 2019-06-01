import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';
let { setRxQuotes } = require('../../helpers/rxQuotes');

const UpdateQuotePopup = ({
    quote,
    styles,
    closeCurrentPopup,
    stateTheme,
    nth,
    quotes = {}
  }) => {
    const [quoteMsg, setQuoteMsg] = useState<string>('');
    const [quoteBy, setQuoteBy] = useState<string>('');
    const [event, setEvent] = useState<string>('');
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        setQuoteMsg(quote.quote);
        setQuoteBy(quote.quoteBy);
        setEvent(quote.event);
        setDate(quote.date);
    }, []);
  
    const saveToDB = () => {

        if (quote.length === 0) return;
        let Quotes = Object.assign({}, quotes);
        Quotes['quotes'][nth - 1].quote = quoteMsg;
        Quotes['quotes'][nth - 1].quoteBy = quoteBy;
        Quotes['quotes'][nth - 1].event = event;
        Quotes['quotes'][nth - 1].date = date;

        setRxQuotes(Quotes);
    };
  
    const save = () => {
      saveToDB();
      closeCurrentPopup();
    };
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <h2>Update Quote</h2>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quote</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setQuoteMsg(e.target.value);
            }}
            value={quoteMsg}
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
            <div className={styles.input_name}>Event</div>
            <textarea
            className={styles.input}
            onChange={e => {
                setEvent(e.target.value);
            }}
            value={event}
            />
        </div>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Date Quoted</div>
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
          UPDATE
        </div>
      </div>
    );
  };
  
  export { UpdateQuotePopup };
  