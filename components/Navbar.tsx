import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";

import { Cart } from "components";
import { useAppContext } from "context/AppContext";

const Navbar = () => {
    const { showCart, setShowCart, totalQuantities } = useAppContext();

    return (
        <div className="navbar-container">
            <p className="logo">
                <Link href="/">Owl Clothes avec Sanity</Link>
            </p>

            <button
                type="button"
                className="cart-icon"
                onClick={() => setShowCart(true)}
            >
                <AiOutlineShopping />
                <span className="cart-item-qty">{totalQuantities}</span>
            </button>

            {showCart && <Cart />}
        </div>
    );
};

export default Navbar;