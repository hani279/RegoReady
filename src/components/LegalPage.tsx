// Shared layout for the terms and privacy pages. Both are working drafts:
// the banner stays until they have been reviewed by a lawyer.
export default function LegalPage(props: {
  title: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 pb-16 pt-10 sm:pt-14">
      <h1 className="font-display text-4xl font-bold">{props.title}</h1>
      <p className="rounded-xl border border-amber-line bg-amber px-4 py-3 text-sm leading-relaxed text-amber-text">
        Draft. This page has not been reviewed by a lawyer and the business
        details are placeholders.
      </p>
      {props.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-bold">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="text-base leading-relaxed text-soft">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
