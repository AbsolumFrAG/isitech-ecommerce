import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CreditCardOutlined } from "@mui/icons-material";
import { IOrder } from "../../interfaces";
import { owlApi } from "../../api";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";

export type OrderResponseBody = {
  id: string;
  status:
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const {
    isPaid,
    numberOfItems,
    tax,
    total,
    subtotal,
    _id,
    orderItems,
    shippingAddress,
  } = order;
  const [isPaying, setIsPaying] = useState(false);

  const router = useRouter();

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("Pas de paiement par Paypal");
    }

    setIsPaying(true);
    try {
      const { data } = await owlApi.post(`/orders/pay`, {
        transactionID: details.id,
        orderID: _id,
      });
      //Si tout va bien
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert("Erreur");
    }
  };

  return (
    <ShopLayout
      title="Résumé de la commande"
      pageDescription="Résumé de la commande"
    >
      <Typography variant="h1" component="h1">
        Commande {_id}
      </Typography>

      <Chip
        sx={{ my: 2 }}
        label={isPaid ? "Commande payée" : "Commande en attente de paiement"}
        variant="outlined"
        color={isPaid ? "success" : "error"}
        icon={<CreditCardOutlined />}
      />

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Résumé ({numberOfItems}{" "}
                {numberOfItems > 1 ? "produits" : "produit"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Adresse de livraison
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>{shippingAddress.address}</Typography>
              <Typography>
                {shippingAddress.city} {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems,
                  subTotal: subtotal,
                  taxes: tax,
                  total,
                }}
              />

              <Box sx={{ mt: 1 }} display="flex" flexDirection="column"></Box>
              {isPaying && (
                <Box display="flex" justifyContent="center" className="fadeIn">
                  <CircularProgress />
                </Box>
              )}
              <Box
                sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                flexDirection="column"
              >
                {isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label={"Commande payée"}
                    variant="outlined"
                    color={"success"}
                    icon={<CreditCardOutlined />}
                  />
                ) : (
                  <Box sx={{ mt: 3 }}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const details = await actions.order!.capture();
                        //Si le paiement est réussi
                        onOrderCompleted(details);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });

  // S'il n'y a pas de session, rediriger vers le login
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/${id}`,
        permanent: false,
      },
    };
  }

  // Vérifier si une commande avec cet id existe
  const order = await dbOrders.getOrderById(id.toString());

  // Si aucune commande, rediriger vers l'historique des commandes
  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  // Si vous êtes connecté mais que vous n'avez pas l'autorisation de visualiser cette commande, redirigez-vous vers l'historique des commandes.
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
