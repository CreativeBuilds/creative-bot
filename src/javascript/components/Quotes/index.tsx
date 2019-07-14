import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { AddQuotePopup } from './AddQuotePopup';
import { MdAddCircle } from 'react-icons/md';
import { Quote } from './Quote';
let { setRxQuotes, firebaseQuotes$ } = require('../../helpers/rxQuotes');

import { TextField } from '../Generics/Input';
import { WidgetButton } from '../Generics/Button';

const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Quotes.scss');

const QuotesPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchQuoteName, setSearchQuoteName] = useState<string>('');
  const { quotes, addPopup, closeCurrentPopup } = props;
  const [quotesObj, setQuotes] = useState(quotes);

  useEffect(() => {
    let listener = firebaseQuotes$.subscribe((data: any) => {
      setQuotes(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  // let quoteArray = _.orderBy(
  //   _.sortBy(quotesObj['quotes'])
  //   .filter(item => {
  //     if (searchQuoteName.trim() === '') return true;
  //     return item.quote
  //       .toLowerCase()
  //       .includes(searchQuoteName.trim().toLowerCase());
  //   }),
  //   [toggle],
  //   [isDesc ? 'desc' : 'asc']
  // );

  const addQuotePopup = () => {
    addPopup(
      <AddQuotePopup
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        quotes={quotesObj}
      />
    );
  };
  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Points}>
      <div
        style={Object.assign(
          {},
          stateTheme.toolBar,
          stateTheme.base.quinaryForeground
        )}
        className={styles.header}
      >
        QUOTES
        <WidgetButton 
          icon={<MdAddCircle />} 
          style={stateTheme.button.widget.add}
          stateTheme={stateTheme} 
          onClick={() => {
            addQuotePopup();
          }}/>
        <TextField 
          placeholderText={"Search..."} 
          stateTheme={stateTheme} 
          width={'150px'}
          style={{
            right: '10px',
            'overflow-y': 'hidden',
            'overflow-x': 'auto',
            position: 'absolute',
          }}
          inputStyle={stateTheme.base.secondaryBackground}
          onChange={e => {
            setSearchQuoteName(e.target.value);
          }}/>
      </div>
      <div style={{}} className={styles.content}>
        {/* TODO ADD PAGINATION */}
        <Sorting
          toggle={toggle}
          setToggle={setToggle}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          styles={styles}
          stateTheme={stateTheme}
        />
        {Object.keys(quotes).map((key, nth) => {
          return (
            <Quote
              styles={styles}
              quote={Object.assign({}, quotes[key], {
                // name: quotes[key].name.trim()
              })}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
              quotes={quotesObj}
            />
          );
        })}
      </div>
    </div>
  );
};

export { QuotesPage };
