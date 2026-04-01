export function FeatureCard({
  title,
  description
}: {
  title: string;
  description: string;
}): JSX.Element {
  return (
    <article className="card feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
