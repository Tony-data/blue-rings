export function SectionHeading({ id, index, eyebrow, title }: { id: string; index: string; eyebrow: string; title: string }) {
  return (
    <div data-reveal="up" className="mb-10">
      <p className="eyebrow text-blue">
        {index} / {eyebrow}
      </p>
      <h2 id={id} className="display mt-3 text-[clamp(2.75rem,6vw,5rem)] leading-none text-ink">
        {title}
      </h2>
    </div>
  );
}
