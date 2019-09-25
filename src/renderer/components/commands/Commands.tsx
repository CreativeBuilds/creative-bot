import * as React from 'react';
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
import { ISize, IListRenderer } from '@/renderer';
import { sortBy, reverse } from 'lodash';
import { Icon } from '../generic-styled-components/Icon';
import { FaEdit, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { AddOrEditCommandPopup } from './AddOrEditCommandPopup';
import { PopupDialogBackground } from '../generic-styled-components/PopupDialog';
import { RemoveCommandPopup } from './RemoveCommandPopup';

import { 
  listItemColor,
  listItemBorderColor,
  listItemBackgroundColor,
  listItemAlternativeColor,
} from '@/renderer/helpers/appearance';

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

interface ICommandColumn {
  hover?: boolean;
}

const CommandsColumn = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: ${(props: ICommandColumn): string =>
    props.hover ? 'none' : 'inherit'};
  &:hover {
    cursor: ${(props: ICommandColumn): string =>
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
    ${(props: ICommandHeader) =>
      props.borderColor ? props.borderColor : listItemBorderColor ? listItemBorderColor : '#d1d1d1'};
  border-bottom: 1px solid
    ${(props: ICommandHeader) =>
      props.borderColor ? props.borderColor : listItemBorderColor ? listItemBorderColor : '#d1d1d1'};
  background: ${(props: ICommandHeader) =>
    props.background ? props.background : listItemAlternativeColor ? listItemAlternativeColor : '#e1e1e1'};
`;

interface ICommandRow {
  alternate: boolean;
  alternateBackground?: string;
  backgroundColor?: string;
}

const CommandRow = styled.div`
  width: -webkit-fill-available;
  height: 40px;
  display: flex;
  align-items: center;
  & > div:nth-child(1) {
    padding-left: 10px;
  }
  background: ${(props: ICommandRow) =>
    props.alternate
      ? props.alternateBackground
        ? props.alternateBackground
        :  listItemAlternativeColor ? listItemAlternativeColor : '#e1e1e1'
      : props.backgroundColor
      ? props.backgroundColor
      :  listItemBackgroundColor ? listItemBackgroundColor : '#f1f1f1'};
`;

/**
 * @description this is the commands page, allows for editing, creating, and deleting of new commands
 */
export const Commands = () => {
  const [commands, setCommands] = React.useState<Command[]>([]);
  const [popup, setPopup] = React.useState<React.ReactElement | null>(null);

  React.useEffect(() => {
    const listener = rxCommands.subscribe(setCommands);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const filteredCommands = commands;

  const closePopup = () => {
    setPopup(null);
  };

  const addCommandPopup = () => {
    setPopup(<AddOrEditCommandPopup closePopup={closePopup} />);
  };

  return (
    <PageMain>
      <PageTitleCustom>
        <div>{getPhrase('commands_name')}</div>
        <PageTitleRightCustom>
          <Icon>
            <FaPlusCircle
              title='Add Command'
              size='25px'
              onClick={addCommandPopup}
            ></FaPlusCircle>
          </Icon>
        </PageTitleRightCustom>
        <CommandsHeader style={{ paddingRight: '5px', paddingBottom: '0px' }}>
          <CommandsColumn style={{ maxWidth: '130px' }}>
            {getPhrase('commands_column_name')}
          </CommandsColumn>
          <CommandsColumn style={{ maxWidth: '90px' }}>
            {getPhrase('commands_column_cost')}
          </CommandsColumn>
          <CommandsColumn>
            {getPhrase('commands_column_response')}
          </CommandsColumn>
          <CommandsColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('commands_column_edit')}
          </CommandsColumn>
          <CommandsColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('commands_column_remove')}
          </CommandsColumn>
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
                rowCount={filteredCommands.length}
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
                    filteredCommands,
                    (mCommand: Command) => {
                      return mCommand.name.toLowerCase();
                    }
                  );
                  const command = sorted[index];
                  const editCommandPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <AddOrEditCommandPopup
                        command={command}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  const removeCommandPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <RemoveCommandPopup
                        command={command}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  return (
                    <CommandRow
                      style={style}
                      key={key}
                      alternate={!!(index % 2)}
                    >
                      <CommandsColumn style={{ maxWidth: '130px' }}>
                        {command.name}
                      </CommandsColumn>
                      <CommandsColumn style={{ maxWidth: '90px' }}>
                        {command.cost}
                      </CommandsColumn>
                      <CommandsColumn>{command.reply}</CommandsColumn>
                      <CommandsColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaEdit
                            size='20px'
                            onClick={editCommandPopup}
                          ></FaEdit>
                        </Icon>
                      </CommandsColumn>
                      <CommandsColumn
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
                            onClick={removeCommandPopup}
                          ></FaTrashAlt>
                        </Icon>
                      </CommandsColumn>
                    </CommandRow>
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
