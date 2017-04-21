import * as _ from "lodash";
import * as fs from "fs";
import * as bunyan from "bunyan";
import * as Logger from "bunyan";

const databaseLogFolder = "server/logs/db.log";
const errorLogFolder = "server/logs/error.log";

function initLogger(): void {
  process.stdout.write("\x1Bc");
  fs.writeFile(databaseLogFolder, "");
  fs.writeFile(errorLogFolder, "");
}

const errorLogger: Logger = bunyan.createLogger({
  name: "error",
  streams: [
    {
      stream: process.stderr,
      level: "error",
    },
    {
      path: errorLogFolder,
      level: "error",
    },
  ],
});

const databaseLogger: Logger = bunyan.createLogger({
  name: "database",
  streams: [
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      path: databaseLogFolder,
      level: "debug",
    },
  ],
});

const infoLogger: Logger = bunyan.createLogger({
  name: "info",
  stream: process.stdout,
  level: "info",
});

function getErrorMessage(error: any) {
  if (!error) {
    return "";
  }

  if (error.isAppError) {
    if (!error.message) {
      let message = `error.${error.type}.${error.code}.${error.data}`;
      if (!message) {
        message = `Cannot find error message for type:${error.type} code:${error.code}`;
      }
      error.message = message;
    }
    if (error.uiShow) {
      return error.message;
    }
  }

  return error.message || error;
}

function logError(err: Error | string): string {
  const message = getErrorMessage(err);
  if (_.isError(err)) {
    errorLogger.error(message);
  }
  return message;
}

function logInfo(msg: string): string {
  infoLogger.info(msg);
  return msg;
}

function logDatabase(msg: string): string {
  databaseLogger.debug(msg);
  return msg;
}

export {
  logError,
  logInfo,
  logDatabase,
  initLogger,
};