import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CartContext, UiContext } from "../../context";
import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";

export const NavBar = () => {
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);
  const router = useRouter();
  const { pathname } = router;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchQuery = () => {
    if (searchQuery.length > 0) {
      router.push(`/search/${searchQuery}`);
    }
  };

  return (
    <AppBar sx={{
      paddingRight: { pr: "100px" },
    }}>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display={"flex"} alignItems="center">
            <Image src={"/logohibou.svg"} width={50} height={50} />
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={pathname === "/category/men" ? "primary" : "info"}>
                Hommes
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button
                color={pathname === "/category/women" ? "primary" : "info"}
              >
                Femmes
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kids" passHref>
            <Link>
              <Button
                color={pathname === "/category/kids" ? "primary" : "info"}
              >
                Enfants
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {isSearchVisible ? (
          <Input
            sx={{
              display: { xs: "none", sm: "flex" },
              backgroundColor: "white"
            }}
            className="fadeIn"
            autoFocus={true}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearchQuery()}
            type="text"
            placeholder="Rechercher..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            className="fadeIn"
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            <SearchOutlined sx={{
              color: "white",
            }} />
          </IconButton>
        )}

        {/* Pour les petits écrans */}
        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={numberOfItems} color="secondary" sx={{ color: 'white' }}>
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
