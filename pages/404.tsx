import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ShopLayout } from "../components/layouts";

const Custom404 = () => {
  return (
    <ShopLayout title={"Page not found"} pageDescription={"Rien à montrer ici"}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems={"center"}
        height="calc(100vh - 200px)"
      >
        <Typography
          variant="h1"
          component={"h1"}
          fontSize={80}
          fontWeight={200}
        >
          404 |
        </Typography>
        <Typography marginLeft={2}>On ne trouve aucune page ici.</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
