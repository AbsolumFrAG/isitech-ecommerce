import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";

import { useAppContext } from "context/AppContext";
import { runFireworks } from "lib/utils";

const Success = () => {
    const { setCartItems, setTotalPrice, setTotalQuantities } = useAppContext();

    useEffect(() => {
        localStorage.clear();
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        runFireworks();
    }, []);

    return (
        <div className="success-wrapper">
            <div className="success">
                <p className="icon">
                    <BsBagCheckFill />
                </p>
                <h2>Merci pour votre commande !</h2>
                <p className="email-msg">Vérifiez vos emails pour le reçu.</p>
                <p className="description">
                    Si vous avez une question, veuillez nous contacter
                    <a className="email" href="mailto:lou.tigroudja07@gmail.com">
                        contact@owl-clothes.com
                    </a>
                </p>
                <Link href="/">
                    <button type="button" className="btn">
                        Continuer le shopping
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Success;