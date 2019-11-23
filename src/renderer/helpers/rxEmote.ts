import { BehaviorSubject, empty, ObservableInput } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { IEmote } from '..';
import { Emote } from './db/db';

/**
 * @description rxEmotes is the behavior subject for getting the layout of all emotes
 * @note this pulls directly from firebase and not local database as it doesn't update very much therefore, should not need to be hindered by using local db like users
 */
export const rxEmotes = rxUser.pipe(
    filter(x => !!x),
    switchMap(
      (authUser): ObservableInput<IEmote[]> => {
        if (!authUser) {
          return empty();
        }
        const ref = firestore
          .collection('users')
          .doc(authUser.uid)
          .collection('emotes');

        console.log(ref);
  
        return collectionData(ref);
      }
    ),
    map((emotes: IEmote[]) =>
      emotes.map(
        (emote): Emote =>
          new Emote(
            emote.id,
            emote.dliveid,
            emote.url
          )
      )
    )
  );