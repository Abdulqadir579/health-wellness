import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

type Section = { heading?: string; body: React.ReactNode };

const StaticPage = ({
  title,
  intro,
  sections,
  updated,
}: {
  title: string;
  intro?: React.ReactNode;
  sections: Section[];
  updated?: string;
}) => {
  return (
    <>
      <Breadcrumb title={title} pages={[title]} />

      <section className="overflow-hidden py-20 bg-white">
        <div className="max-w-[870px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {updated && (
            <p className="text-custom-sm text-dark-4 mb-7.5">
              Last updated: {updated}
            </p>
          )}

          {intro && (
            <p className="mb-9 text-dark-4 leading-relaxed text-lg">{intro}</p>
          )}

          <div className="flex flex-col gap-7.5">
            {sections.map((section, index) => (
              <div key={index}>
                {section.heading && (
                  <h2 className="font-serif font-medium text-xl sm:text-2xl text-dark mb-3">
                    {section.heading}
                  </h2>
                )}
                <div className="text-dark-4 leading-relaxed flex flex-col gap-3">
                  {section.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StaticPage;
