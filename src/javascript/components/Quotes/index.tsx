import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { AddQuotePopup } from './AddQuotePopup';
import { MdAddCircle } from 'react-icons/md';
import { Quote } from './Quote';
let { setRxQuotes, firebaseQuotes$ } = require('../../helpers/rxQuotes');

import { TextField, SearchField } from '../Generics/Input';
import { WidgetButton } from '../Generics/Button';
import { Page, PageHeader, PageBody } from '../Generics/Common';

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
    <Page stateTheme={stateTheme} style={stateTheme.base.tertiaryBackground}>
      <PageHeader
        style={stateTheme.base.quinaryForeground}
        stateTheme={stateTheme}>
        QUOTES
        <WidgetButton 
          icon={<MdAddCircle />} 
          style={stateTheme.button.widget.add}
          stateTheme={stateTheme} 
          onClick={() => {
            addQuotePopup();
          }}/>
        <SearchField
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
      </PageHeader>
      <PageBody stateTheme={stateTheme}>
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
      </PageBody>
    </Page>
  );
};

export { QuotesPage };
