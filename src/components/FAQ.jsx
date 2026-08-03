import { Accordion } from "./ui/accordion.jsx";
import { faq } from "../data/profile.jsx";

export default function FAQ() {
  return (
    <section id="faq" className="section-pad relative">
      <div className="wrap max-w-3xl">
        <p className="eyebrow">Details</p>
        <h2 className="section-title mt-3">FAQ</h2>
        <p className="section-lead">
          Quick answers for recruiters and hiring managers.
        </p>
        <div className="mt-10">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  );
}
