import { Router } from "express";
import {
  getAllComments,
  addComment,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentsByPublication,
  getCommentsByUser
} from "./comment.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";

const api = Router();

api.get("/", getAllComments);

api.get("/:id", getCommentById);

api.post(
  "/",
  [ uploadProfilePicture.single("commentImage")],
  addComment
);

api.put(
  "/:id",
  [ uploadProfilePicture.single("commentImage")],
  updateComment
);

api.delete("/:id", [validateJwt], deleteComment);

api.get('/publication/:publicationId', getCommentsByPublication)
api.get('/user/:userId', getCommentsByUser)


export default api;
