import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import Reveal from "../Common/Reveal";

const Home = () => {
  return (
    <main>
      <Hero />
      <Reveal>
        <Categories />
      </Reveal>
      <Reveal>
        <NewArrival />
      </Reveal>
      <Reveal>
        <PromoBanner />
      </Reveal>
      <Reveal>
        <BestSeller />
      </Reveal>
      <Reveal>
        <CounDown />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
    </main>
  );
};

export default Home;
