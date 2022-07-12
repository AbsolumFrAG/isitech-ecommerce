import NextLink from "next/link";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layouts";

const EmptyPage = () => {
  return (
    <ShopLayout
      title="Panier vide"
      pageDescription="Aucun article dans le panier"
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems={"center"}
        height="calc(100vh - 200px)"
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Votre panier est vide</Typography>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secondary">
              Retour
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
