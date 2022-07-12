import { Chip, Grid, Typography, Link } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nom complet", width: 300 },
  {
    field: "paid",
    headerName: "Payé",
    description: "Indique si la commande a été payée ou non",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Payé" variant="outlined" />
      ) : (
        <Chip color="error" label="En attente" variant="outlined" />
      );
    },
  },
  {
    field: "showorder",
    sortable: false,
    headerName: "Voir la commande",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row._id}`} passHref>
          <Link underline="always">Voir la commande</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      paid: order.isPaid,
      _id: order._id,
    };
  });

  return (
    <ShopLayout
      title="Historique des commandes"
      pageDescription="Historique des commandes des clients"
    >
      <Typography variant="h1" component={"h1"}>
        Historique des commandes
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/history`,
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrderByUserId(session.user._id);

  return {
    props: {
      id: session.user._id,
      orders,
    },
  };
};

export default HistoryPage;
