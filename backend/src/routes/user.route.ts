import { Router } from "express";
import { removeAvatar, updateAvatar, updateProfile } from "../controllers/userController.js";
import upload from "../middleware/upload.js";
import { updateProfileSchema } from "../validations/user.validation.js";
import validate from "../middleware/validate.js";

const route = Router()

route.patch("/", validate(updateProfileSchema), updateProfile)
route.patch("/avatar", upload.single("avatar"), updateAvatar)
route.delete("/remove_avatar", removeAvatar)

export default route