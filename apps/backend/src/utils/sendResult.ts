import { Response } from "express";

export default (res: Response, data: any, meta = {}, count?: number) => {
    const json: any = { status: 1, responseCode: 200, data };
    if (count !== undefined) {
        json.count = count;
    } else if (Array.isArray(data)) {
        json.count = data.length;
    }
    res.json({ ...json, ...meta });
};
