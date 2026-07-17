"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-serif font-semibold text-heading-4 sm:text-heading-3 text-blue">
                Heritage
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Handwoven
                <br />
                Collection
              </span>
            </div>

            <h1 className="font-serif font-semibold text-dark text-xl sm:text-3xl mb-3">
              <Link href="/shop-with-sidebar">
                Kashmiri Pashmina &amp; Cashmere Shawls
              </Link>
            </h1>

            <p>
              Hand-embroidered pashmina and cashmere wraps, woven by artisans and
              chosen for timeless elegance.
            </p>

            <Link
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </Link>
          </div>

          <div>
            <Image
              src="/images/products/gsp-women-handwoven-pashmina-shawl-1.jpg"
              alt="handwoven pashmina shawl"
              width={351}
              height={358}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-serif font-semibold text-heading-4 sm:text-heading-3 text-blue">
                Elegance
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Evening
                <br />
                Wear
              </span>
            </div>

            <h1 className="font-serif font-semibold text-dark text-xl sm:text-3xl mb-3">
              <Link href="/shop-with-sidebar">
                Evening Dresses, Abayas &amp; Kaftans
              </Link>
            </h1>

            <p>
              Flowing silhouettes and refined detailing for occasions that call
              for something truly special.
            </p>

            <Link
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </Link>
          </div>

          <div>
            <Image
              src="/images/products/gsp-gold-prom-dress-1.avif"
              alt="evening dress"
              width={351}
              height={358}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
