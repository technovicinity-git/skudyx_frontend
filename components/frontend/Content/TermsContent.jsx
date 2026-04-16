import React from "react";

const TermsContent = ({ content }) => {
  return (
    <section className="relative pt-36 pb-24 entry-content">
      <div className="container">
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
};

export default TermsContent;
