import { db, User } from '../db/db';

/**
 * @description a behavior subject that gets all users
 */
export const getUsers = async () => {
  return db.users.toArray();
};
