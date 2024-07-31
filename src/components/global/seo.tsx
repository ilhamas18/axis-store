import React from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";

interface TypeProps {
  title?: string;
  description?: string;
}
function SEO({ title, description }: TypeProps) {
  return (
    <>
      <NextSeo
        title={`${
          title ?? "Beli Kartu Perdana Bonus Paket Online di AXIS Store"
        } - AXIS`}
        description={
          description
            ? description
            : "Cara mudah beli kartu perdana AXIS secara online di AXIS Store. Pesan kartu perdana dengan beragam pilihan paket sesuai kebutuhan kamu, info cara pesan disini!"
        }
      />

      <Head>
        <link rel="icon" type="image/png" href="/icons/axis.svg"></link>
        {/* <script type="text/javascript" src="/script.meta.js" /> */}
      </Head>
    </>
  );
}

export default SEO;
