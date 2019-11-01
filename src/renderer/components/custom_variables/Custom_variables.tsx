import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { Command } from '@/renderer/helpers/db/db';
import { rxCommands } from '@/renderer/helpers/rxCommands';
import styled from 'styled-components';
import { getPhrase } from '@/renderer/helpers/lang';
import { AutoSizer, List } from 'react-virtualized';
import { ISize, IListRenderer, ICustomVariable } from '@/renderer';
import { sortBy, reverse } from 'lodash';
import { Icon } from '../generic-styled-components/Icon';
import {
  FaEdit,
  FaPlusCircle,
  FaTrashAlt,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { AddOrEditVariablePopup } from './AddOrEditVariablePopup';
import { PopupDialogBackground } from '../generic-styled-components/PopupDialog';
import { RemoveVariablePopup } from './RemoveVariablePopup';

import {
  listItemColor,
  listItemBorderColor,
  listItemBackgroundColor,
  listItemAlternativeColor
} from '@/renderer/helpers/appearance';
import {
  rxCustomVariables,
  CustomVariable
} from '@/renderer/helpers/rxCustomVariables';
import { map } from 'rxjs/operators';

const PageContentCustom = styled(PageContent)`
  padding: unset;
`;

const PageTitleCustom = styled(PageTitle)`
  overflow: hidden;
  min-height: 55px;
  & > div {
    padding-bottom: 19px;
  }
`;

const PageTitleRightCustom = styled(PageTitleRight)`
  padding-bottom: 19px;
  height: 47px;
`;

interface IVariableColumn {
  hover?: boolean;
}

const VariableColumn = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: ${(props: IVariableColumn): string =>
    props.hover ? 'none' : 'inherit'};
  &:hover {
    cursor: ${(props: IVariableColumn): string =>
      props.hover ? 'pointer' : 'unset'};
  }
`;

interface ICommandHeader {
  background?: string;
  borderColor?: string;
}

const CommandsHeader = styled.div`
  height: 25px;
  display: flex;
  position: absolute;
  align-items: center;
  bottom: 0px;
  width: -webkit-fill-available;
  font-size: 18px;
  left: 0;
  padding-left: 10px;
  border-top: 1px solid
    ${(props: ICommandHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  border-bottom: 1px solid
    ${(props: ICommandHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  background: ${(props: ICommandHeader): ThemeSet | string =>
    props.background
      ? props.background
      : listItemAlternativeColor
      ? listItemAlternativeColor
      : '#e1e1e1'};
`;

interface ICommandRow {
  alternate: boolean;
  alternateBackground?: string;
  backgroundColor?: string;
}

const VariableRow = styled.div`
  width: calc(100% - 5px);
  height: 40px;
  display: flex;
  align-items: center;
  & > div:nth-child(1) {
    padding-left: 10px;
  }
  background: ${(props: ICommandRow): ThemeSet | string =>
    props.alternate
      ? props.alternateBackground
        ? props.alternateBackground
        : listItemAlternativeColor
        ? listItemAlternativeColor
        : '#e1e1e1'
      : props.backgroundColor
      ? props.backgroundColor
      : listItemBackgroundColor
      ? listItemBackgroundColor
      : '#f1f1f1'};
`;

/**
 * @description this is the commands page, allows for editing, creating, and deleting of new commands
 */
export const Custom_Variables = () => {
  const [variables, setVariables] = React.useState<CustomVariable[]>([]);
  const [popup, setPopup] = React.useState<React.ReactElement | null>(null);

  React.useEffect(() => {
    const listener = rxCustomVariables
      .pipe(
        map(mVariables => {
          return Object.keys(mVariables).reduce(
            (acc: CustomVariable[], key: string) => {
              acc.push(mVariables[key]);

              return acc;
            },
            []
          );
        })
      )
      .subscribe(setVariables);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const filteredVariables = variables;

  const closePopup = () => {
    setPopup(null);
  };

  const addVariablePopup = () => {
    setPopup(<AddOrEditVariablePopup closePopup={closePopup} />);
  };

  return (
    <PageMain>
      <PageTitleCustom style={{ boxShadow: 'unset' }}>
        <div>{getPhrase('custom_variables_name')}</div>
        <PageTitleRightCustom>
          <Icon>
            <FaPlusCircle
              title={getPhrase('custom_variables_add')}
              size='25px'
              onClick={addVariablePopup}
            ></FaPlusCircle>
          </Icon>
        </PageTitleRightCustom>
        <CommandsHeader style={{ paddingRight: '5px', paddingBottom: '0px' }}>
          <VariableColumn style={{ maxWidth: '130px' }}>
            {getPhrase('custom_variables_column_name')}
          </VariableColumn>
          <VariableColumn style={{ flex: 1 }}>
            {getPhrase('custom_variables_column_string')}
          </VariableColumn>
          <VariableColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '75px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('custom_variables_column_toggle')}
          </VariableColumn>
          <VariableColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('custom_variables_column_remove')}
          </VariableColumn>
        </CommandsHeader>
      </PageTitleCustom>
      <PageContentCustom>
        <AutoSizer>
          {(size: ISize) => {
            const { width, height } = size;

            return (
              <List
                style={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
                width={width}
                height={height}
                rowHeight={40}
                rowCount={filteredVariables.length}
                rowRenderer={({
                  index,
                  key,
                  style
                }: IListRenderer): React.ReactElement => {
                  /**
                   * @description takes allUsers and sorts by filter
                   *
                   * Note: if filter is displayname then it needs to toLowerCase all the names, else lowercase and uppercase will be seperated
                   */
                  const sorted = sortBy(
                    filteredVariables,
                    (mCommand: Command) => {
                      return mCommand.name.toLowerCase();
                    }
                  );
                  const variable = sorted[index] as CustomVariable;
                  const editCommandPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <AddOrEditVariablePopup
                        variable={variable}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  const removeVariablePopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <RemoveVariablePopup
                        variable={variable}
                        closePopup={mClosePopup}
                      />
                    );
                  };
                  /**
                   * @description enables/disables the command in firestore which will retrigger the rx feed
                   */
                  const swapEnable = () => {
                    if (variable.isEval) {
                      variable.isEval = false;
                      variable.save();
                    } else {
                      variable.isEval = true;
                      variable.save();
                    }
                  };

                  return (
                    <VariableRow
                      style={{
                        ...style,
                        ...(filteredVariables.length * 40 < height
                          ? { width: 'calc(100% - 5px)', paddingRight: '5px' }
                          : {})
                      }}
                      key={key}
                      alternate={!!(index % 2)}
                    >
                      <VariableColumn style={{ maxWidth: '130px' }}>
                        {variable.name}
                      </VariableColumn>
                      <VariableColumn style={{ flex: 1 }}>
                        {variable.replyString}
                      </VariableColumn>
                      <VariableColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '75px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {variable.isEval ? (
                          <Icon>
                            <FaToggleOn onClick={swapEnable} size='25px' />
                          </Icon>
                        ) : (
                          <Icon>
                            <FaToggleOff onClick={swapEnable} size='25px' />
                          </Icon>
                        )}
                      </VariableColumn>
                      <VariableColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaTrashAlt
                            size='20px'
                            onClick={removeVariablePopup}
                          ></FaTrashAlt>
                        </Icon>
                      </VariableColumn>
                    </VariableRow>
                  );
                }}
              />
            );
          }}
        </AutoSizer>
      </PageContentCustom>
      {popup ? <PopupDialogBackground>{popup}</PopupDialogBackground> : null}
    </PageMain>
  );
};
