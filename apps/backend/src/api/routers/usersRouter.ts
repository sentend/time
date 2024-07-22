import { Router } from "express";
import { Request, Response } from "express";
import "express-async-errors";

const usersRouter = Router();

// //todo change any to type
// usersRouter.get("/users", async (req: Request<{}, {}, {}, any>, res: Response) => {
//     const result = await getUsersService(req.workspace!, req.query, req.user!);
//     res.json(result);
// });

export default usersRouter;
