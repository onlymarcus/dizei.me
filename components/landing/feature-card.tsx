type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: boolean;
};

export function FeatureCard({
  icon,
  title,
  description,
  accent = false,
}: FeatureCardProps) {
  return (
    <article
      className={`glass-card h-full p-6 ${
        accent ? "border-brand-100 bg-brand-50/70" : ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
