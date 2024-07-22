import { Router } from "express";
import { Request, Response } from "express";
import "express-async-errors";
import sendResult from "../../utils/sendResult";

export const router = Router();

// router.get("/workspaces", async (req: Request<{}, {}, {}, any>, res: Response) => {
//     // const result = await currentWorkspaceService(req.query);
//     // res.json(result);
// });

// router.get(
//     "/workspaces/:workspaceId",
//     async (req: Request<{}, {}, {}, any>, res: Response) => {
//         const result = await getWorkspaceService(req.query);
//         sendResult(res, result);
//     }
// );

// router.get("/users", async (req: Request, res: Response) => {
//     // const result = await getUsersService(req.workspace!, filter, sorting, paging, req.user!);
//     sendResult(res, result);
// });

export default router;
//todo add delete, update
