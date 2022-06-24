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

/*
import React from 'react'
import { NavLink } from "react-router-dom";
import style from "Navbar.module.css"
import { BsFillHeartFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

export function NavBar() {
  return (
    <nav className="navbar-container">
      <NavLink to="/">
        OWL CLOTHES
      </NavLink>
      <NavLink to="/">Homme</NavLink>
      <NavLink to="/">Femme</NavLink>
      <NavLink to="/"><BsFillHeartFill/></NavLink>
      <NavLink to="/"><BsFillPersonFill/></NavLink>
      <NavLink to="/"><FiShoppingCart/></NavLink>
    </nav>
  );
}
*/
