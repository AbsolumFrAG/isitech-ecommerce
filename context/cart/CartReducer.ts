import {
  ICartProduct,
  IOrderSummary,
  IShippingAddress,
} from "../../interfaces";
import { CartState } from "./";

type CartActionType =
  | {
      type: "[Cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Update Cart"; payload: ICartProduct[] }
  | { type: "[Cart] - Change Product Quantity"; payload: ICartProduct }
  | { type: "[Cart] - Remove Product"; payload: ICartProduct }
  | { type: "[Cart] - Update Order Summary"; payload: IOrderSummary }
  | {
      type: "[Cart] - Load ShippingAddress from cookies";
      payload: IShippingAddress;
    }
  | { type: "[Cart] - Update ShippingAddress"; payload: IShippingAddress }
  | { type: "[Cart] - Order Complete" };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "[Cart] - Update Cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[Cart] - Change Product Quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;
          return action.payload;
        }),
      };
    case "[Cart] - Remove Product":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };
    case "[Cart] - Update Order Summary":
      return {
        ...state,
        ...action.payload,
      };
    case "[Cart] - Load ShippingAddress from cookies":
    case "[Cart] - Update ShippingAddress":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "[Cart] - Order Complete":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        taxes: 0,
        total: 0,
      };

    default:
      return state;
  }
};
