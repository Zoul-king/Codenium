interface PrivacyCopyProps {
  items: string[];
}

export function PrivacyCopy({ items }: PrivacyCopyProps) {
  return (
    <section className="section soft-section bg-surface-soft py-20">
      <div className="privacy-copy" data-animate="fadeIn">
        {items.map((item) => (
          <p key={item} className="type-body">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
