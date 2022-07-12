import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { IProduct, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Photo",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia component={"img"} image={row.img} alt={row.title} />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Titre",
    width: 350,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Genre" },
  { field: "type", headerName: "Type" },
  { field: "inStock", headerName: "Inventaire" },
  { field: "price", headerName: "Prix" },
  { field: "sizes", headerName: "Tailles", width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));

  return (
    <AdminLayout
      title={`Produits (${data?.length})`}
      subtitle="Gestion des produits"
      pageDescription="Gestion des produits"
      icon={<CategoryOutlined />}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Créer un produit
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid
          item
          xs={12}
          sx={{ height: 650, width: "100%" }}
          overflow={{ xs: "scroll", md: "auto" }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
