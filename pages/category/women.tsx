import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"Owl Clothes - Femmes"}
      pageDescription={"Produits pour femmes"}
    >
      <Typography variant="h1" component={"h1"}>
        Femmes
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Tous les produits
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
