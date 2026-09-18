import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "users.json");

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

// ponytail: local JSON-file store for now; swap for Supabase Auth later, callers don't change.
export function signup(username, password) {
  if (!username || !password) {
    return { ok: false, error: "아이디와 비밀번호를 입력해주세요." };
  }
  const users = readUsers();
  if (users[username]) {
    return { ok: false, error: "이미 존재하는 아이디입니다." };
  }
  const salt = crypto.randomBytes(16).toString("hex");
  users[username] = { salt, hash: hashPassword(password, salt) };
  writeUsers(users);
  return { ok: true, username };
}

export function login(username, password) {
  const users = readUsers();
  const user = users[username];
  if (!user) {
    return { ok: false, error: "존재하지 않는 아이디입니다." };
  }
  if (hashPassword(password, user.salt) !== user.hash) {
    return { ok: false, error: "비밀번호가 올바르지 않습니다." };
  }
  return { ok: true, username };
}
