import React, { useRef } from "react";
import Link from "next/link";
import {
    AiOutlineMinus,
    AiOutlinePlus,
    AiOutlineLeft,
    AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

import { useAppContext } from "context/AppContext";
import { urlFor } from "lib/sanity-client";
import getStripe from "lib/getStripeService";

const Cart = () => {
    const cartRef = useRef(null);

    const {
        totalPrice,
        totalQuantities,
        cartItems,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
    } = useAppContext();

    const handlePayment = async () => {
        const stripe = await getStripe();
        const params = {
            cartItems,
        };

        const response = await fetch("/api/stripe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (response.status === 500) return;

        const data = await response.json();
        toast.loading("Redirection...");
        stripe.redirectToCheckout({ sessionId: data.id });
    };

    return (
        <div className="cart-wrapper" ref={cartRef}>
            <div className="cart-container">
                <button
                    type="button"
                    className="cart-heading"
                    onClick={() => setShowCart(false)}
                >
                    <AiOutlineLeft />
                    <span className="heading">Votre panier</span>
                    <span className="cart-num-items">({totalQuantities}) items</span>
                </button>

                {cartItems.length < 1 && (
                    <div className="empty-cart">
                        <AiOutlineShopping size={150} />
                        <h3>Votre panier est vide</h3>
                        <Link href="/">
                            <button
                                type="button"
                                onClick={() => setShowCart(false)}
                                className="btn"
                            >
                                Continuer le shopping
                            </button>
                        </Link>
                    </div>
                )}

                <div className="product-container">
                    {cartItems.length >= 1 &&
                        cartItems.map((item) => (
                            <div className="product" key={item._id}>
                                <img
                                    src={urlFor(item?.image[0]).toString()}
                                    className="cart-product-image"
                                    alt="cart-product"
                                />
                                <div className="item-desc">
                                    <div className="flex top">
                                        <h5>{item.name}</h5>
                                        <h4>${item.price}</h4>
                                    </div>
                                    <div className="flex bottom">
                                        <div>
                                            <p className="quantity-desc">
                                                <span
                                                    className="minus"
                                                    onClick={() =>
                                                        toggleCartItemQuantity(item._id, "dec")
                                                    }
                                                >
                                                    <AiOutlineMinus />
                                                </span>
                                                <span className="num">{item.quantity}</span>
                                                <span
                                                    className="plus"
                                                    onClick={() =>
                                                        toggleCartItemQuantity(item._id, "inc")
                                                    }
                                                >
                                                    <AiOutlinePlus />
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-item"
                                            onClick={() => onRemove(item)}
                                        >
                                            <TiDeleteOutline />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {cartItems.length >= 1 && (
                    <div className="cart-bottom">
                        <div className="total">
                            <h3>Sous-total :</h3>
                            <h3>${totalPrice}</h3>
                        </div>
                        <div className="btn-container">
                            <button type="button" className="btn" onClick={handlePayment}>
                                Payer avec Stripe
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;