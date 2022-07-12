import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
import { CartContext } from "../../context";

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get("firstName") || "",
    lastName: Cookies.get("lastName") || "",
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    zip: Cookies.get("zip") || "",
    city: Cookies.get("city") || "",
    country: Cookies.get("country") || "",
    phone: Cookies.get("phone") || "",
  };
};

const AddressPage = () => {
    const router = useRouter();
    const { updateShippingaddress } = useContext(CartContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: '',
        },
    });

    useEffect(() => {
        reset(getAddressFromCookies());
    }, [reset]);

    const onSubmitAddress = (data: FormData) => {
        updateShippingaddress(data);
        router.push('/checkout/summary');
    };

    return (
        <ShopLayout
            title="Adresse"
            pageDescription="Confirmer l'adresse de destination"
        >
            <form onSubmit={handleSubmit(onSubmitAddress)}>
                <Typography variant="h1" component="h1">
                    Adresse
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nom"
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Prénom"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Adresse"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Adresse 2 (optionnel)"
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Code postal"
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ville"
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Pays"
                            fullWidth
                            {...register('country', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Téléphone"
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Ce champ est requis',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                    >
                        Revoir la commande
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

export default AddressPage;