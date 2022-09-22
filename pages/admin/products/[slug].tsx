import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GetServerSideProps } from "next";
import { AdminLayout } from "../../../components/layouts";
import { IProduct } from "../../../interfaces";
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { dbProducts } from "../../../database";
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { owlApi } from "../../../api";
import Product from "../../../models/Products";

const validTypes = ["shirts", "pants", "hoodies", "hats"];
const validGender = ["men", "women", "kid", "unisex"];
const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTagValue, setNewTagValue] = useState("");
  const [isSaving, setisSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "title") {
        const newSlug =
          value.title
            ?.trim()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
            .toLocaleLowerCase() || "";

        setValue("slug", newSlug);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onChangeFile = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      for (const file of target.files) {
        const formData = new FormData();

        formData.append("file", file);
        const { data } = await owlApi.post<{ message: string }>(
          "/admin/upload",
          formData
        );
        setValue("images", [...getValues("images"), data.message], {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (form: FormData) => {
    if (form.images.length < 2) {
      alert("Vous devez télécharger au moins 2 images");
      return;
    }
    setisSaving(true);

    try {
      const { data } = await owlApi({
        url: "/admin/products",
        method: form._id ? "PUT" : "POST", //Si nous avons un id, mettre à jour, sinon créer
        data: form,
      });

      if (!form._id) {
        router.replace(`/admin/products/${form.slug}`);
      } else {
        setisSaving(false);
      }
    } catch (error) {
      console.log(error);
      setisSaving(false);
    }
  };

  const onChangeSize = (size: string) => {
    const currentSizes = getValues("sizes");
    if (currentSizes.includes(size)) {
      return setValue(
        "sizes",
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }

    setValue("sizes", [...currentSizes, size], { shouldValidate: true });
  };

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLowerCase();
    setNewTagValue("");
    const currentTags = getValues("tags");

    if (currentTags.includes(newTag)) {
      return;
    }
    currentTags.push(newTag);
  };

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues("tags").filter((t) => t !== tag);
    setValue("tags", updatedTags, { shouldValidate: true });
  };

  const onDeleteImage = (img: string) => {
    setValue(
      "images",
      getValues("images").filter((image) => image !== img),
      { shouldValidate: true }
    );
  };

  return (
    <AdminLayout
      title={"Produit"}
      subtitle={`Edition : ${product.title}`}
      pageDescription="Edition de produit"
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
            disabled={isSaving}
          >
            Sauvegarder
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Titre"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title", {
                required: "Ce champ est requis",
                minLength: { value: 2, message: "Minimum 2 caractères" },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              variant="filled"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register("description", {
                required: "Ce champ est requis",
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Inventaire"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("inStock", {
                required: "Ce champ est requis",
                min: { value: 0, message: "Valeur minimale 0" },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Prix"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("price", {
                required: "Ce champ est requis",
                min: { value: 0, message: "Valeur minimale 0" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                row
                value={getValues("type")}
                onChange={(e) =>
                  setValue("type", e.target.value, { shouldValidate: true })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Genre</FormLabel>
              <RadioGroup
                row
                value={getValues("gender")}
                onChange={(e) =>
                  setValue("gender", e.target.value, { shouldValidate: true })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tailles</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox checked={getValues("sizes").includes(size)} />
                  }
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("slug", {
                required: "Ce champ est requis",
                validate: (value) =>
                  value.trim().includes(" ")
                    ? "Ne peut pas contenir d'espaces"
                    : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquette"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Appuyez sur la [barre espace] pour ajouter"
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) =>
                code === "Space" ? onNewTag() : undefined
              }
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues("tags").map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Charger une image
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/gif"
                style={{ display: "none" }}
                onChange={onChangeFile}
              />

              <Chip
                label="Au moins 2 images sont requises"
                color="error"
                variant="outlined"
                sx={{
                  mb: 3,
                  display: getValues("images").length < 2 ? "flex" : "none",
                }}
              />

              <Grid container spacing={2}>
                {getValues("images").map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() => onDeleteImage(img)}
                        >
                          Supprimer
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  let product: IProduct | null;

  if (slug === "new") {
    // Créer le produit
    const tempProduct = JSON.parse(JSON.stringify(new Product()));

    delete tempProduct._id;
    tempProduct.images = ["img1.jpg", "img2.jpg"];

    product = tempProduct;
  } else {
    // Actualiser le produit
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
