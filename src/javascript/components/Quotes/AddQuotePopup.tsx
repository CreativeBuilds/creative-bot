import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';
let { setRxQuotes } = require('../../helpers/rxQuotes');

const AddQuotePopup = ({
    styles,
    closeCurrentPopup,
    stateTheme,
    quotes = {}
  }) => {
    const [quote, setQuote] = useState<string>('');
    const [quoteLimit, setQuoteLimit] = useState(113);
    const [quoteBy, setQuoteBy] = useState<string>('');
    const [quoteByLimit, setQuoteByLimit] = useState(20);
    const [event, setEvent] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [hasError, setHasError] = useState<Boolean>(false);
    const [hasQuoteLimitError, setHasQuoteLimitError] = useState<Boolean>(false);
    const [hasQuoteByLimitError, setHasQuoteByLimitError] = useState<Boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      setEvent('DLive');
      setDate(dd + '/' + mm + '/' + yyyy);
    }, []);
  
    const saveToDB = () => {

        if (quote.length === 0) return;
        let Quotes = Object.assign({}, quotes);

        var quoteId =  Quotes['quotes'].length;

        if (quoteLimit >= 0) {
          if (quoteByLimit >= 0) {
            Quotes['quotes'].push({
              quoteId,
              quote,
              quoteBy,
              event,
              date
            }) as Array<Object>;
            setHasError(false);
            setRxQuotes(Quotes);
            closeCurrentPopup();
          } else {
            setHasError(true);
            setErrorMsg('QuoteBy 20 Character Limit has been exceeded!');
          }
        } else {
          setHasError(true);
          setErrorMsg('Quote Message 113 Character Limit has been exceeded!');
        }
    };
  
    const save = () => {
      saveToDB();
    };
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <h2>Add a Quote</h2>
        {hasError ? <h4 className={styles.errorMsg}>{errorMsg}</h4> : null }
        <div className={styles.input_wrapper}>
            <div className={styles.input_name}>Quote (Characters Left: <span className={hasQuoteLimitError ? styles.errorMsg : null}>{quoteLimit}</span> )</div>
            <textarea
            className={styles.input}
            onChange={e => {
                var limitVal = 113 - e.target.value.length;
                setQuoteLimit(limitVal);
                setHasQuoteLimitError(limitVal < 0 ? true : false);
                setQuote(e.target.value);
            }}
            value={quote}
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
  