import { BehaviorSubject, empty, ObservableInput } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { ICommand } from '..';
import { Command } from './db/db';

/**
 * @description rxCommands is the behavior subject for getting the layout of all commands
 * @note this pulls directly from firebase and not local database as it doesn't update very much therefore, should not need to be hindered by using local db like users
 */
export const rxCommands = rxUser.pipe(
  filter(x => !!x),
  switchMap(
    (authUser): ObservableInput<ICommand[]> => {
      if (!authUser) {
        return empty();
      }
      const ref = firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('commands');

      return collectionData(ref);
    }
  ),
  map((commands: ICommand[]) =>
    commands.map(
      (command): Command =>
        new Command(
          command.name,
          command.name,
          command.permissions || [],
          command.reply,
          command.cost || 0
        )
    )
  )
);
