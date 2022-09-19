import NextLink from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { UiContext } from "../../context";
import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";

export const AdminNavBar = () => {
  const { toggleSideMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display={"flex"} alignItems="center">
            <Image src={"/logohibou.svg"} width={50} height={50} />
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
