import { Router } from "express";
import { login, restrictTo, signup } from "../controllers/auth.controller";
import {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect } from "../middlewares/authorize";
import {
  userSignupValidator,
  userLoginValidator,
} from "../middlewares/user.validator";

const router: Router = Router();

router.post("/signup", userSignupValidator, signup);
router.post("/login", userLoginValidator, login);

router.route("/").get(protect, getAllUsers).post(createUser);
router.use(protect);

router.use(protect);
router.use(restrictTo("admin"));
router
  .route("/:id")
  .get(getOneUser)
  .patch(updateUser)

  .delete(deleteUser);

export default router;
