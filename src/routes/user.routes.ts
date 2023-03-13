import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "../controllers/auth.controller";
import {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser,
  deleteMyAccount,
  getMe,
  updateMyData,
} from "../controllers/user.controller";
import { protect } from "../middlewares/authorize";
import {
  userSignupValidator,
  userLoginValidator,
} from "../middlewares/user.validator";

const router: Router = Router();

router.post("/signup", userSignupValidator, signup);
router.post("/login", userLoginValidator, login);
router.post("/:userId/posts", userLoginValidator, login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
router.patch("/updateMyPassword", updatePassword);
router.patch(
  "/updateMyData",
  updateMyData
);
router.get("/me", getMe, getOneUser);
router.delete("/deleteMyAccount", deleteMyAccount);

router.route("/").get(restrictTo("admin"), getAllUsers).post(createUser);

router.use(restrictTo("admin"));
router
  .route("/:id")
  .get(getOneUser)
  .patch(updateUser)

  .delete(deleteUser);

export default router;
