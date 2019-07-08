import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Quote } from './Quote';
let { setRxQuotes } = require('../../helpers/rxQuotes');

import { Button, DestructiveButton, ActionButton } from '../Generics/Button';
import { TextField } from '../Generics/Input';

const AddQuotePopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  quotes = {}
}) => {
  const [quote, setQuote] = useState<string>('');
  const [quoteLimit, setQuoteLimit] = useState(90);
  const [quoteBy, setQuoteBy] = useState<string>('');
  const [quoteByLimit, setQuoteByLimit] = useState(20);
  const [event, setEvent] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [hasError, setHasError] = useState<Boolean>(false);
  const [hasQuoteLimitError, setHasQuoteLimitError] = useState<Boolean>(false);
  const [hasQuoteByLimitError, setHasQuoteByLimitError] = useState<Boolean>(
    false
  );
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

    delete Quote['quotes'];

    let counter = 0;

    Object.keys(Quotes).forEach(key => {
      let intOfKey = Number(key);
      if (!counter && !Quotes[intOfKey + 1]) {
        counter = intOfKey + 1;
      }
    });

    let quoteId = counter.toString();

    if (quoteLimit >= 0) {
      if (quoteByLimit >= 0) {
        Quotes[quoteId] = {
          quoteId,
          quote,
          quoteBy,
          event,
          date
        };
        setHasError(false);
        setRxQuotes(Quotes);
        closeCurrentPopup();
      } else {
        setHasError(true);
        setErrorMsg('QuoteBy 20 Character Limit has been exceeded!');
      }
    } else {
      setHasError(true);
      setErrorMsg('Quote Message 90 Character Limit has been exceeded!');
    }
  };

  const save = () => {
    saveToDB();
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Add a Quote</h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        {hasError ? <h4 className={styles.errorMsg}>{errorMsg}</h4> : null}
        <TextField 
          text={quote}
          placeholderText={"Quote"} 
          header={
            <div>
              Quote (Characters Left:{' '}
              <span className={hasQuoteLimitError ? styles.errorMsg : null}>
                {quoteLimit}
              </span>{' '}
              )
            </div>
          }
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            var limitVal = 90 - e.target.value.length;
            setQuoteLimit(limitVal);
            setHasQuoteLimitError(limitVal < 0 ? true : false);
            setQuote(e.target.value);
          }}/>
        <TextField 
          text={quoteBy}
          placeholderText={"Quote"} 
          header={
            <div>
              Quoted By (Characters Left:{' '}
              <span className={hasQuoteByLimitError ? styles.errorMsg : null}>
                {quoteByLimit}
              </span>{' '}
              )
            </div>
          }
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            var limitVal = 20 - e.target.value.length;
            setQuoteByLimit(limitVal);
            setHasQuoteByLimitError(limitVal < 0 ? true : false);
            setQuoteBy(e.target.value);
          }}/>
        <TextField 
          text={event}
          placeholderText={"Event"} 
          header={"Event (Optional)"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setEvent(e.target.value);
          }}/>
        <TextField 
          text={date}
          placeholderText={"Date Quoted"} 
          header={"Date Quoted (Optional)"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setDate(e.target.value);
          }}/>
        <Button 
          title={"Create"} 
          isSubmit={true} 
          stateTheme={stateTheme}  
          onClick={save} />
      </div>
    </div>
  );
};

export { AddQuotePopup };
