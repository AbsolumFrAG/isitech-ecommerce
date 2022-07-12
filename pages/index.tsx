import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products";
import { FullScreenLoading } from "../components/ui";
import { useProducts } from "../hooks";

const Home: NextPage = () => {
  const { products, isLoading } = useProducts("/products");

  return (
    <ShopLayout
      title={"Owl Clothes - Accueil"}
      pageDescription={"Page principale de Owl Clothes"}
    >
      <Typography variant="h1" component={"h1"}>
        Boutique
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Tous les produits
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default Home;

