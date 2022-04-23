import { Router } from "express";
import { isLoggedIn } from "./middlewares";
import User from "../models/user";

const userRouter = Router();

// POST /:id/follow
userRouter.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));

      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default userRouter;
