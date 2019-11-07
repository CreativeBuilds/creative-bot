import { collectionData } from 'rxfire/firestore';
import { firestore } from './firebase';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const word_map_ref = firestore.collection('word_map');

/**
 * @description an observable that returns all word maps
 */
export const rxWordMap = new BehaviorSubject<
  { [id: string]: { [id: string]: string } } | undefined
>(undefined);

/**
 * @description this is what loads all the map information from firestore
 *
 * on start it checks for all languages and then maps all the variables together under their own
 * languages
 *
 */
function getMapRefs() {
  word_map_ref
    .get()
    .then(async (collection: firebase.firestore.QuerySnapshot) => {
      console.log('INSIDE THE THEN', collection);
      const promiseArr: Promise<any>[] = [];
      const lang_map: { [id: string]: { [id: string]: string } } = {};
      collection.forEach(lang => {
        promiseArr.push(
          lang.ref
            .collection('partials')
            .get()
            .then((partials: firebase.firestore.QuerySnapshot) => {
              /**
               * A partial is A document on firestore that contains multiple variables (up to 1MB worth)
               * that need to be mapped together on the client
               */
              const merge: { [id: string]: string } = {};
              partials.forEach(partial => {
                const data: { [id: string]: string } = partial.data();
                Object.keys(data).forEach((key: string) => {
                  merge[key] = data[key];
                });
              });
              lang_map[lang.ref.id] = merge;

              return merge;
            })
            .catch(err => null)
        );
      });
      await Promise.all(promiseArr).catch(err => {
        console.log('Got error!', err);
      });
      rxWordMap.next(lang_map);
    })
    .catch(err => {
      console.log('got err', err);
      setTimeout(() => {
        getMapRefs();
      }, 5000);
    });
}

getMapRefs();
