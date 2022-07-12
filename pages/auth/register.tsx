import React, { useState, useContext } from "react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Chip,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { isEmail } from "../../utils/validations";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "../../context";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const destination = router.query.page?.toString() || "/";

  const onSubmit: SubmitHandler<FormData> = async ({
    email,
    password,
    name,
  }) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    // router.replace(destination);
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="S'inscrire">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Créer un compte
              </Typography>
              <Chip
                label={errorMessage}
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nom"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "Ce champ est obligatoire",
                  minLength: {
                    value: 3,
                    message: "Le nom doit contenir au moins 3 caractères",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Ce champ est obligatoire",
                  validate: (value) => isEmail(value),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mot de passe"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "Ce champ est obligatoire",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Créer un compte
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.page
                    ? `/auth/register?page=${destination}`
                    : "/auth/register"
                }
                passHref
              >
                <Link underline="always">
                  Vous avez déjà un compte ? Connectez-vous à votre compte
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { page = "/" } = query;
  if (session) {
    return {
      redirect: {
        destination: page.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
