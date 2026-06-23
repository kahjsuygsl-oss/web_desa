export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-primary to-secondary py-14 text-white">
      <div className="container">
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/90">{subtitle}</p>}
      </div>
    </section>
  );
}
