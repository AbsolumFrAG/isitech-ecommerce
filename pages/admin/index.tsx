import {
  AttachMoneyOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  GroupOutlined,
  CategoryOutlined,
  CancelPresentationOutlined,
  ProductionQuantityLimitsOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";
import { DashboardSummaryResponse } from "../../interfaces/dashboard";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30000,
    }
  );

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return (
      <Typography variant="h4">
        Erreur du chargement des informations
      </Typography>
    );
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title="Tableau de bord admin"
      subtitle="Statistiques générales"
      pageDescription="Statistiques générales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle="Commandes totales"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subtitle="Commandes payées"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subtitle="Commandes en cours"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subtitle="Clients"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subtitle="Produits"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithNoInventory}
          subtitle="Produits en rupture de stock"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={lowInventory}
          subtitle="Faible inventaire"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subtitle="Actualisation dans ..."
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
