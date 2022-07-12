import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IPaypal } from "../../../interfaces";
import { Order } from "../../../models";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL || "";

  const base64token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(PAYPAL_OAUTH_URL, body, {
      headers: {
        Authorization: `Basic ${base64token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const paypalBearerToken = await getPaypalBearerToken();

  if (!paypalBearerToken) {
    return res
      .status(500)
      .json({ message: "Erreur d'obtention du Token Paypal" });
  }

  const { transactionID = "", orderID = "" } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionID}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );
  //Vérifiez si le paiement a été accepté
  if (data.status !== "COMPLETED") {
    return res
      .status(401)
      .json({ message: "Le paiement n'a pas été effectué" });
  }

  await db.connect();
  const dbOrder = await Order.findById(orderID);

  //Vérifier si la commande existe dans la base de données
  if (!dbOrder) {
    await db.disconnect();
    return res.status(404).json({ message: "La commande n'existe pas" });
  }

  // Vérifiez que le montant payé correspond au montant de la commande dans la bdd.
  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res
      .status(401)
      .json({
        message: "Le montant payé ne correspond pas au montant de la commande",
      });
  }

  // Si tout se passe bien, nous marquons la commande comme payée et ajoutons l'ID de la transaction.
  dbOrder.transactionId = transactionID;
  dbOrder.isPaid = true;
  await dbOrder.save();

  await db.disconnect();
  return res.status(200).json({ message: "Commade payée" });
};
