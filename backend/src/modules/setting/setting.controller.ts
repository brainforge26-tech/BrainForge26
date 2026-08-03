import { Request, Response, NextFunction } from 'express';
import * as settingService from './setting.service';

export async function getPublicSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await settingService.getAllSettings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getSettingByKey(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.params.key as string;
    const data = await settingService.getSettingsByKey(key);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.params.key as string;
    const { value } = req.body;
    const data = await settingService.upsertSetting(key, value);
    res.json({ success: true, data, message: 'Settings updated successfully' });
  } catch (err) {
    next(err);
  }
}
