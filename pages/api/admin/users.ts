import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

type Data = { message: string } | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);

    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select("-password");
  await db.disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userID = "", role = "" } = req.body;

  if (!isValidObjectId(userID)) {
    return res.status(400).json({ message: "UserID invalide" });
  }

  const validRoles = ["admin", "user", "super-user", "CEO"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  await db.connect();
  const user = await User.findById(userID);

  if (!user) {
    await db.disconnect();
    return res.status(400).json({ message: "Utilisateur non trouvé" });
  }

  user.role = role;
  await user.save();

  await db.disconnect();

  return res.status(200).json({ message: "Utilisateur actualisé" });
};
