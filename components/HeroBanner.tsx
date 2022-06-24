import Link from "next/link";
import React from "react";
import { BannerData } from "types-definition/types";
import { urlFor } from "lib/sanity-client";
import Image from "next/image";

interface Props {
    data: BannerData;
}

const HeroBanner = ({ data }: Props) => {
    return (
        <div className="hero-banner-container">
            <div>
                <p className="beats-solo">{data.smallText}</p>
                <h3>{data.midText}</h3>
                <h1>{data.largeText1}</h1>
                <Image
                    src={urlFor(data.image).toString()}
                    alt="headphones"
                    className="hero-banner-image"
                />

                <div>
                    <Link href={`/product/${data.product}`}>
                        <button type="button">{data.buttonText}</button>
                    </Link>
                    <div className="desc">
                        <h5>Description</h5>
                        <p>{data.desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;