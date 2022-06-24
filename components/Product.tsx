import React from "react";
import Link from "next/link";
import { urlFor } from "lib/sanity-client";

import { Product } from "types-definition/types";

interface Props {
    product: Product;
}

const Product = ({ product: { image, name, slug, price } }: Props) => {
    return (
        <div>
            <Link href={`/product/${slug.current}`}>
                <div className="product-card">
                    {image.length && (
                        <img
                            src={urlFor(image[0]).toString()}
                            width={250}
                            height={250}
                            className="product-image"
                            alt="product"
                        />
                    )}
                    <p className="product-name">{name}</p>
                    <p className="product-price">${price}</p>
                </div>
            </Link>
        </div>
    );
};

export default Product;