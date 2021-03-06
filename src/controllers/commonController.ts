import { sendMail } from "../utils/mailer";
import helper from "./controllerHelper";
import { logInfo } from "../logger";
import {Request, Response} from "express";

export default class CommonController {

  public static async mailSender(req: Request, res: Response): Promise<void> {
    try {
      const from = req.body.from;
      const message = req.body.message;
      const theme = req.body.theme;
      const result = await sendMail(from, theme, message);
      logInfo("Mail is sent!");
      helper.sendData(res, result);
    } catch (err) {
      helper.sendFailureMessage(err, res);
    }
  }

}
