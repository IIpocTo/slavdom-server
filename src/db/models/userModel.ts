import mongoose from "../db";
import userSchema from "../schemas/userSchema";
import * as logger from "../../logger";
import {MongoError} from "mongodb";
import {User} from "../../types/User";

export default class UserModel {

  private mongooseUserModel: any;

  constructor() {
    this.mongooseUserModel = mongoose.model<User>("User", userSchema);
  }

  public async create(user: User) {
    const userObject = this.mongooseUserModel(user);
    return userObject.save((err: MongoError) => {
      if (err) {
        throw err;
      }
      logger.logDatabase(`User ${user.username} has been created.`);
      return true;
    });
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<User> {
    return this.mongooseUserModel
      .findOne({
        $or: [
          { username },
          { email },
        ],
      })
      .exec((err: MongoError, user: User) => {
        if (err) {
          throw err;
        }
        return user;
      });
  }

  public async getUserByUsername(username: string): Promise<User> {
    return this.mongooseUserModel
      .findOne({
        username,
      })
      .exec((err: MongoError, user: User) => {
      if (err) {
        throw err;
      }
      return user;
    });
  }

  public async checkUniqueness(username: string, email: string): Promise<User> {
    return this.mongooseUserModel
      .findOne({
        $or: [
          { username },
          { email },
        ],
      }, "username email")
      .exec((err: MongoError, user: User) => {
        if (err) {
          throw err;
        }
        return user;
      });
  }

  public async checkUsernameUniqueness(username: string): Promise<User> {
    return this.mongooseUserModel
      .findOne({
        username,
      }, "username")
      .exec((err: MongoError, user: User) => {
        if (err) {
          throw err;
        }
        return user;
      });
  }

  public async checkEmailUniqueness(email: string): Promise<User> {
    return this.mongooseUserModel
      .findOne({
        email,
      }, "email")
      .exec((err: MongoError, user: User) => {
        if (err) {
          throw err;
        }
        return user;
      });
  }

}
