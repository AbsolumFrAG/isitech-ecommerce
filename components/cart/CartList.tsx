import {
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import NextLink from "next/link";
import { FC, useContext } from "react";
import { CartContext } from "../../context";
import { ItemCounter } from "../ui";
import { ICartProduct } from "../../interfaces";
import { IOrderItem } from "../../interfaces/orderItem";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  //Si nous envoyons les produits par les props nous les montrons, sinon nous les obtenons du contexte.
  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid
          container
          spacing={2}
          sx={{ mb: 1 }}
          key={product.slug + product.size}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant={"body1"}>{product.title}</Typography>
              <Typography variant={"body1"}>
                Taille : <strong>{product.size}</strong>
              </Typography>

              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  updateQuantity={(value) =>
                    onNewCartQuantityValue(product as ICartProduct, value)
                  }
                />
              ) : (
                <Typography variant={"body1"}>
                  Quantité :{" "}
                  <strong>
                    {product.quantity}{" "}
                    {product.quantity > 1 ? "produits" : "produit"}
                  </strong>
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems={"center"}
            justifyContent="center"
            flexDirection="column"
          >
            <Typography variant={"subtitle1"}>{product.price}€</Typography>
            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeCartProduct(product as ICartProduct)}
              >
                Supprimer
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
