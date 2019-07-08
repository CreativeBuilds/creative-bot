import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';
let { setRxQuotes } = require('../../helpers/rxQuotes');

import { Button, DestructiveButton, ActionButton } from '../Generics/Button';
import { TextField } from '../Generics/Input';

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
  const [hasQuoteByLimitError, setHasQuoteByLimitError] = useState<Boolean>(
    false
  );
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
        if (quoteMsg.length === 0) return;
        let Quotes = Object.assign({}, quotes);
        let Quote = Object.assign({}, Quotes[quote.quoteId]);

        Quote.quote = quoteMsg;
        Quote.quoteBy = quoteBy;
        Quote.event = event;
        Quote.date = date;
        setHasError(false);
        console.log('SETTING RX QUOTES HERE');
        let newObj = {};
        newObj[quote.quoteId] = Quote;
        setRxQuotes(Object.assign({}, Quotes, newObj));
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
      <h2>Update Quote</h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        {hasError ? <h4 className={styles.errorMsg}>{errorMsg}</h4> : null}
        <TextField 
          text={quoteMsg}
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
            setQuoteMsg(e.target.value);
          }}/>
        <TextField 
          text={quoteBy}
          placeholderText={"Quoted By"} 
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
          title={"Update"} 
          isSubmit={true} 
          stateTheme={stateTheme}  
          onClick={save} />
      </div>
    </div>
  );
};

export { UpdateQuotePopup };
