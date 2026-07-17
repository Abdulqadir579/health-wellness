import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F0EA] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              Kashmiri Pashmina Collection
            </span>

            <h2 className="font-serif font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              Handwoven Heritage Shawls
            </h2>

            <p>
              Hand-embroidered pashmina and cashmere wraps, crafted by skilled
              artisans for warmth, softness, and timeless elegance.
            </p>

            <Link
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Shop Now
            </Link>
          </div>

          <Image
            src="/images/products/gsp-shawl-wrap-pashmina-scarf-kashmiri-hand-made-1.jpg"
            alt="pashmina shawl"
            className="absolute bottom-0 right-4 lg:right-26 -z-1 rounded-lg object-cover h-[350px] w-[274px]"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#EDE3D5] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/products/gsp-party-abaya-1.avif"
              alt="abaya"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1 rounded-lg object-cover h-[241px] w-[181px]"
              width={181}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">
                Abayas &amp; Kaftans
              </span>

              <h2 className="font-serif font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Elegant Modest Wear
              </h2>

              <p className="font-semibold text-custom-1 text-blue">
                New Collection
              </p>

              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-custom-sm text-white bg-dark py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-blue mt-9"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#F3E7E8] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/products/gsp-sexy-brazilian-bikini-set-1.avif"
              alt="swimwear"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1 rounded-lg object-cover h-[200px] w-[160px]"
              width={160}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
                Summer Swimwear
              </span>

              <h2 className="font-serif font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Beach &amp; Poolside
              </h2>

              <p className="max-w-[285px] text-custom-sm">
                Bikinis and swimsuits designed to flatter, in fresh seasonal
                prints and cuts.
              </p>

              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
