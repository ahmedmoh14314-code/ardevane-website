import Image from "next/image";
import hero from "@/public/img/hero.jpg";

// The photo and the card that the sign-in and sign-up pages share
function AuthCard({ eyebrow, title, intro, children }) {
  return (
    <div className="relative isolate flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Image
        src={hero}
        alt=""
        fill
        placeholder="blur"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-brand-950/40" />

      <div className="w-full max-w-md animate-rise rounded-3xl bg-white/95 p-8 text-center shadow-lift backdrop-blur sm:p-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="mb-3 font-display text-4xl text-brand-900">{title}</h1>
        <p className="mb-8 text-ink-600">{intro}</p>

        {children}
      </div>
    </div>
  );
}

// "or" between Google and the email form
export function Divider() {
  return (
    <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-ink-400">
      <span className="h-px flex-1 bg-cream-200" />
      or
      <span className="h-px flex-1 bg-cream-200" />
    </div>
  );
}

export default AuthCard;
