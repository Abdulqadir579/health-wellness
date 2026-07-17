import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../../Common/Reveal";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <Reveal className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </Reveal>

          <Reveal className="xl:max-w-[393px] w-full" delay={0.15}>
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-serif font-semibold text-dark text-xl mb-20">
                      <Link href="/shop-with-sidebar">
                        Pashmina &amp; Shawls
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        heritage collection
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          AED 100
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/products/gsp-crimson-court-1.jpg"
                      alt="pashmina shawl"
                      width={123}
                      height={161}
                      className="rounded-md object-cover h-[161px] w-[123px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-serif font-semibold text-dark text-xl mb-20">
                      <Link href="/shop-with-sidebar">
                        Evening Dresses &amp; Abayas
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        new arrivals
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          AED 100
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/products/gsp-arabic-evening-dress-1.avif"
                      alt="evening dress"
                      width={123}
                      height={161}
                      className="rounded-md object-cover h-[161px] w-[123px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
