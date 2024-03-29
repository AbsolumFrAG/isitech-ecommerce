import jwt from "jsonwebtoken";

export const formatMoney = (amount: number): string => {
  return Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const signToken = (_id: string, email: string): string => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("JWT_SECRET_SEED is not defined");
  }

  return jwt.sign(
    //Payload
    { _id, email },
    //Secret
    process.env.JWT_SECRET_SEED,
    //Options
    {
      expiresIn: "30d",
    }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("JWT_SECRET_SEED is not defined");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (error, payload) => {
        if (error) {
          reject(error);
        }
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

export const countries = [
  {
    name: "France",
    code: "FR",
  },
  {
    name: "Great Britain",
    code: "GB",
  },
];
