import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { v2 as cloudinary } from "cloudinary";

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" }).lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("cloudi")
        ? image
        : `${process.env.HOST_NAME}/products/${image}`;
    });

    return product;
  });

  res.status(200).json(updatedProducts);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res
      .status(400)
      .json({ message: "L'ID du produit n'est pas valide" });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Vous devez ajouter au moins 2 images" });
  }

  // TODO: Il est possible que nous ayons un localhost:3000/products/imagen.jpg.

  try {
    await db.connect();
    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: "Le produit n'existe pas" });
    }

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileID, extension] = image
          .substring(image.lastIndexOf("/") + 1)
          .split(".");
        await cloudinary.uploader.destroy(fileID);
      }
    });

    await product.update(req.body);
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    console.log(error);

    return res.status(400).json({ message: "Examiner les logs du serveur" });
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Vous devez ajouter au moins 2 images" });
  }

  // TODO: Il est possible que nous ayons un localhost:3000/products/imagen.jpg.

  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });

    if (productInDB) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "Un produit avec ce slug existe déjà" });
    }

    const product = new Product(req.body);
    await product.save();

    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: "Examiner les logs du serveur" });
  }
};
