import axios from "axios";
import * as cheerio from "cheerio";
import { Book } from "../model/book.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const DUMMY_USER = {
  email: "user@test.com",
  password: "12345678",
};
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
    throw new ApiError(401, "Invalid email or password");
  }
  // Create JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRY || "1h",
  });
  return res.status(200).json(new ApiResponse("Login successful", { token }));
});

const scrapeBooks = asyncHandler(async (req, res) => {
  const baseUrl = "http://books.toscrape.com/";
  const { data } = await axios.get(baseUrl);
  const $ = cheerio.load(data);

  const books = [];

  $(".product_pod").each((i, el) => {
    const title = $(el).find("h3 a").attr("title");
    const price = $(el).find(".price_color").text();
    const href = $(el).find("h3 a").attr("href");
    const link = new URL(href, baseUrl).href;

    books.push({ title, link, price });
  });

  const inserted = await Book.insertMany(books);

  res.status(200).json(new ApiResponse("Books scraped successfully", inserted));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  return res.status(200).json(new ApiResponse("All books fetched", books));
});

export { login, scrapeBooks, getAllBooks };
