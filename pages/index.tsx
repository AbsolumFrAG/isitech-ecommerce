import type { NextPage } from "next";

import { client } from "lib/sanity-client";
import { HeroBanner, FooterBanner, Product } from "components";
import { Product as TProduct, BannerData } from "../types-definition/types";

interface Props {
  products: TProduct[];
  bannerData: BannerData[];
}

const Home: NextPage<Props> = ({ products, bannerData }) => {
  return (
    <section>
      {bannerData?.length && bannerData[1] && (
        <HeroBanner data={bannerData[1]} />
      )}

      <section className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </section>
      {bannerData?.length && bannerData[0] && (
        <FooterBanner data={bannerData[0]} />
      )}
    </section>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData },
  };
};

export default Home;