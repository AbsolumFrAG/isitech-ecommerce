import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID de la commande", width: 250 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "name", headerName: "Nom complet", width: 200 },
  { field: "total", headerName: "Montant total", width: 100 },
  {
    field: "isPaid",
    headerName: "Payé",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Payé" color="success" />
      ) : (
        <Chip variant="outlined" label="En attente" color="error" />
      );
    },
  },
  {
    field: "quantProduct",
    headerName: "Qté",
    align: "center",
    width: 100,
  },
  {
    field: "check",
    headerName: "Voir commande",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Voir la commande
        </a>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Créé le",
    align: "center",
    width: 300,
  },
];

const OrderPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    quantProduct: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title="Commandes"
      subtitle="Gestion des commandes"
      pageDescription="Gestion des commandes"
      icon={<ConfirmationNumberOutlined />}
    >
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

export default OrderPage;
