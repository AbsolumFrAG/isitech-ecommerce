import { Typography } from "@mui/material";
import type { NextPage, GetServerSideProps } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  query: string;
  foundProducts: boolean;
}

const SearchPage: NextPage<Props> = ({ products, query, foundProducts }) => {
  return (
    <ShopLayout
      title={"Owl Clothes - Rechercher"}
      pageDescription={"Recherche de produits"}
    >
      <Typography variant="h1" component={"h1"}>
        Rechercher un produit
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
          Correspondances pour la recherche : {query}
        </Typography>
      ) : (
        <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
          Aucun résultat trouvé pour votre recherche : {query}
        </Typography>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let products = await dbProducts.getProductsByQuery(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getProductsByQuery("shirts");
  }

  return {
    props: {
      products,
      query,
      foundProducts,
    },
  };
};

export default SearchPage;
