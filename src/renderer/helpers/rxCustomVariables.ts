import { BehaviorSubject, empty, ObservableInput } from 'rxjs';
import { ICustomVariable, IChatObject } from '..';
import { rxUsers } from './rxUsers';
import { filter, switchMap, map, first } from 'rxjs/operators';
import { collectionData } from 'rxfire/firestore';
import { firestore } from './firebase';
import { rxUser } from './rxUser';

// tslint:disable-next-line: completed-docs
export class CustomVariable implements ICustomVariable {
  public name: string;
  public replyString: string;
  public isEval: boolean | null;
  constructor(name: string, replyString: string, isEval: boolean | null) {
    this.name = name;
    this.replyString = replyString;
    this.isEval = isEval;
  }

  // tslint:disable-next-line: promise-function-async
  public run = (message: IChatObject) => {
    const replyString = this.replyString;
    const isEval = this.isEval;

    return new Promise(res => {
      // tslint:disable-next-line: no-eval no-void-expression
      return res(!isEval ? replyString : eval(replyString));
    });
  };

  public toJSON() {
    return {
      name: this.name,
      replyString: this.replyString,
      isEval: this.isEval
    };
  }

  /**
   * @description saves the variable to firestore
   */
  public save() {
    rxUser
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(user => {
        if (!user) {
          return;
        }

        firestore
          .collection('configs')
          .doc(user.uid)
          .collection('custom_variables')
          .doc(this.name)
          .set(this.toJSON())
          .catch(null);
      });
  }

  public delete() {
    rxUser
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(user => {
        if (!user) {
          return;
        }

        firestore
          .collection('configs')
          .doc(user.uid)
          .collection('custom_variables')
          .doc(this.name)
          .delete()
          .catch(null);
      });
  }
}

/**
 * @description rxCustomVariables provides all user and bot defined variables in an BehaviorSubject
 */
export const rxCustomVariables = rxUser.pipe(
  filter(x => !!x),
  switchMap(
    (authUser): ObservableInput<ICustomVariable[]> => {
      if (!authUser) {
        return empty();
      }

      const ref = firestore
        .collection('configs')
        .doc(authUser.uid)
        .collection('custom_variables');

      return collectionData(ref);
    }
  ),
  map((custom_variables: ICustomVariable[]) => {
    const customMap: { [name: string]: CustomVariable } = {};
    custom_variables.forEach((variable): void => {
      customMap[variable.name.toLowerCase()] = new CustomVariable(
        variable.name,
        variable.replyString,
        variable.isEval
      );
    });

    return customMap;
  })
);
