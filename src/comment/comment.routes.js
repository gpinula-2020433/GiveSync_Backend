import { Router } from "express";
import {
  getAllComments,
  addComment,
  updateComment,
  deleteComment,
  getCommentById
} from "./comment.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";

const api = Router();

api.get("/", getAllComments);

api.get("/:id", [validateJwt], getCommentById);

api.post(
  "/",
  [validateJwt, uploadProfilePicture.single("commentImage"), deleteFileOnError],
  addComment
);

api.put(
  "/:id",
  [validateJwt, uploadProfilePicture.single("commentImage"), deleteFileOnError],
  updateComment
);

api.delete("/:id", [validateJwt], deleteComment);

export default api;
