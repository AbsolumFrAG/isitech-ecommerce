import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { AdminLayout } from "../../components/layouts";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import { owlApi } from "../../api";
import { useState, useEffect } from "react";

const UserPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  const onRoleUpdated = async (userID: string, newRole: string) => {
    const previousUsers = users.map((user) => ({ ...user }));
    const updateUsers = users.map((user) => ({
      ...user,
      role: user._id === userID ? newRole : user.role,
    }));
    setUsers(updateUsers);

    try {
      await owlApi.put("/admin/users", { userID, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      alert("Le rôle de l'utilisateur n'a pas pu être mis à jour.");
      console.log(error);
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", width: 250 },
    { field: "name", headerName: "Nom complet", width: 300 },
    {
      field: "role",
      headerName: "Rôle",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rôle"
            onChange={(event) => onRoleUpdated(row.id, event.target.value)}
            sx={{ width: "300px" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super-User</MenuItem>
            <MenuItem value="CEO">CEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));
  return (
    <AdminLayout
      title={"Utilisateurs"}
      pageDescription={"Gestion des utilisateurs"}
      subtitle={"Gestion des utilisateurs"}
      icon={<PeopleOutline />}
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

export default UserPage;
