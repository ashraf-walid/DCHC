// src/api/users.js
import bcrypt from "bcryptjs";

export const users = [
  {
    username: "ELDAWOUDY",
    passwordHash: bcrypt.hashSync("123456", 10),
    debitCode: "01000700010004202300010000", 
  },
  {
    username: "ALBANNA",
    passwordHash: bcrypt.hashSync("12345", 10),
    debitCode: "01000700010004200800010000",
  },
  {
    username: "ALEKHLAS",
    passwordHash: bcrypt.hashSync("1234", 10),
    debitCode: "01000700010004212700010000",
  },
  {
    username: "ALHILAL",
    passwordHash: bcrypt.hashSync("123", 10),
    debitCode: "01000700010004210800010000",
  },
];

