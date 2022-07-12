import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");

  return (
    <ShopLayout
      title={"Owl Clothes - Hommes"}
      pageDescription={"Productos pour les hommes"}
    >
      <Typography variant="h1" component={"h1"}>
        Hommes
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Tous les produits
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
