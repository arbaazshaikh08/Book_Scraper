import { Router } from "express";
import { getAllBooks, login, scrapeBooks } from "../controller/books.controller.js";
import { verifyJWT } from "../middlewere/Auth.middlewere.js";

const router = Router();

router.route("/login").post(login)
router.route("/scrape-book").post(verifyJWT,scrapeBooks);
router.route("/getAll-Book").get(verifyJWT, getAllBooks);

export default router;
