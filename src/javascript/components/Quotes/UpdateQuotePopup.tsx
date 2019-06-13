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
    const [quoteLimit, setQuoteLimit] = useState(90 - quote.quote.length);
    const [quoteBy, setQuoteBy] = useState<string>('');
    const [quoteByLimit, setQuoteByLimit] = useState(20 - quote.quoteBy.length);
    const [event, setEvent] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [hasError, setHasError] = useState<Boolean>(false);
    const [hasQuoteLimitError, setHasQuoteLimitError] = useState<Boolean>(false);
    const [hasQuoteByLimitError, setHasQuoteByLimitError] = useState<Boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => {
        setQuoteMsg(quote.quote);
        setQuoteBy(quote.quoteBy);
        setEvent(quote.event);
        setDate(quote.date);
        setQuoteLimit(96 - quoteMsg.length);
        setQuoteByLimit(20 - quoteBy.length);
    }, []);
  
    const saveToDB = () => {

      if (quoteLimit >= 0) {
        if (quoteByLimit >= 0) {
          if (quote.length === 0) return;
          let Quotes = Object.assign({}, quotes);
          Quotes['quotes'][nth - 1].quote = quoteMsg;
          Quotes['quotes'][nth - 1].quoteBy = quoteBy;
          Quotes['quotes'][nth - 1].event = event;
          Quotes['quotes'][nth - 1].date = date;
          setHasError(false);
          setRxQuotes(Quotes);
          closeCurrentPopup();
        } else {
          setHasError(true);
          setErrorMsg('QuoteBy 20 Character Limit has been exceeded!');
        }
      } 
      else {
        setHasError(true);
        setErrorMsg('Quote Message 90 Character Limit has been exceeded!');
      }
    };
  
    const save = () => {
      saveToDB();
    };
  
    return (
      <div className={styles.popup}>
        <h2>Update Quote</h2>
        {hasError ? <h4 className={styles.errorMsg}>{errorMsg}</h4> : null }
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quote (Characters Left: <span className={hasQuoteLimitError ? styles.errorMsg : null}>{quoteLimit}</span> )</div>
            <textarea
            className={styles.input}
            onChange={e => {
                var limitVal = 90 - e.target.value.length;
                setQuoteLimit(limitVal);
                setHasQuoteLimitError(limitVal < 0 ? true : false);
                setQuoteMsg(e.target.value);
            }}
            value={quoteMsg}
            />
        </div>
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quoted By (Characters Left: <span className={hasQuoteByLimitError ? styles.errorMsg : null}>{quoteByLimit}</span> )</div>
            <textarea
            className={styles.input}
            onChange={e => {
                var limitVal = 20 - e.target.value.length;
                setQuoteByLimit(limitVal);
                setHasQuoteByLimitError(limitVal < 0 ? true : false);
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
          style={stateTheme.submitButton}
        >
          UPDATE
        </div>
      </div>
    );
  };
  
  export { UpdateQuotePopup };
  