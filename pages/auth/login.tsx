import { useEffect, useState } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
  Divider,
} from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { SubmitHandler, useForm } from "react-hook-form";
import { isEmail } from "../../utils/validations";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProvider] = useState<any>({});

  useEffect(() => {
    getProviders()
      .then((res) => {
        setProvider(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("finally");
      });
  }, []);
  const destination = router.query.page?.toString() || "/";

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    setShowError(false);

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Se connecter">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Connexion
              </Typography>
              <Chip
                label="Nous ne reconnaissons pas cet utilisateur / mot de passe"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
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
                      "Le mot de passe doit comporter au moins 6 caractères",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                type="submit"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Se connecter
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
                <Link underline="always">Vous n&apos;avez pas de compte ?</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              flexDirection={"column"}
              justifyContent="end"
            >
              <Divider sx={{ width: "100%", mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials")
                  return <div key="credentials"></div>;
                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
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

export default LoginPage;
