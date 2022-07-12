import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidsPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title={"Owl Clothes - Enfants"}
      pageDescription={"Produits pour les enfants"}
    >
      <Typography variant="h1" component={"h1"}>
        Enfants
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Tous les produits
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
