import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { FC, useReducer, useEffect } from "react";
import { IUser } from "../../interfaces";
import { AuthContext, AuthReducer } from "./";
import owlApi from "../../api/owlApi";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth] - Login", payload: data.user as IUser });
    }
  }, [status, data]);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await owlApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token); // On set le token dans le cookie
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await owlApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string };

        return {
          hasError: true,
          message,
        };
      }

      return {
        hasError: true,
        message: "Une erreur s'est produite lors de l'inscription",
      };
    }
  };

  const logoutUser = async () => {
    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("country");
    Cookies.remove("city");
    Cookies.remove("zip");
    Cookies.remove("phone");

    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        //Méthodes
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
