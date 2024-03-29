import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Product, Order } from "../../../models";

type Data = { message: string } | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // Vérifier que nous avons un utilisateur
  const session: any = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ message: "Vous devez être authentifié pour le faire." });
  }

  // Créez un arrangement avec les produits que la personne souhaite
  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )?.price;
      if (!currentPrice) {
        throw new Error(
          "Vérifiez à nouveau le panier, le produit n'existe pas."
        );
      }

      return currentPrice * current.quantity + prev;
    }, 0);
    const taxes = subTotal * 0.21;
    const backendTotal = subTotal + taxes;

    if (total !== backendTotal) {
      console.log(
        `Les montants totaux ne correspondent pas, [front : ${total} | back : ${backendTotal}].`
      );

      throw new Error(
        `Les montants totaux ne correspondent pas, commande rejetée`
      );
    }

    // Tout va bien jusqu'à ce point
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || "Examiner les logs du serveur",
    });
  }
};
