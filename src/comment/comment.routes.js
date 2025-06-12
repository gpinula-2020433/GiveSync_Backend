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
import {addCommentV, updateCommentV} from "../../middlewares/validators.js"
import { deleteFileOnError } from '../../middlewares/delete.file.on.errors.js';

const api = Router();

api.get("/", getAllComments);

api.get("/:id", getCommentById);

api.post(
  "/",
  [ validateJwt,uploadProfilePicture.single("commentImage"),deleteFileOnError,addCommentV],
  addComment
);

api.put(
  "/:id",
  [ validateJwt,uploadProfilePicture.single("commentImage"), updateCommentV],
  updateComment
);

api.delete("/:id", [validateJwt], deleteComment);

api.get('/publication/:publicationId', getCommentsByPublication)
api.get('/user/:userId', getCommentsByUser)


export default api;
