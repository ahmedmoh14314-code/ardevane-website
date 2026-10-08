import { LogoStacked } from "./Logo";

// Sign in and sign up: a plain page, the Ardevane mark on top and the
// form under it, nothing else.
function AuthPanel({ children }) {
  return (
    <div className="flex justify-center px-5 pb-16 pt-10 sm:px-6 md:min-h-[calc(100vh-4.5rem)] md:items-center md:py-14">
      <section className="w-full max-w-md animate-rise md:rounded-md md:border md:border-sand-200 md:bg-white md:px-11 md:py-10 md:shadow-soft">
        <div className="mb-7">
          <LogoStacked />
        </div>
        {children}
      </section>
    </div>
  );
}

export function AuthHeading({ title, intro }) {
  return (
    <header className="mb-7 text-center">
      <h2 className="font-display text-[2rem] leading-tight text-forest-950">
        {title}
      </h2>
      <p className="mt-1.5 font-label text-[0.95rem] leading-relaxed text-ink-600">
        {intro}
      </p>
    </header>
  );
}

// "or", between the form and Google
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-4 font-label text-[0.8rem] uppercase tracking-widest text-ink-500">
      <span className="h-px flex-1 bg-sand-300" />
      or
      <span className="h-px flex-1 bg-sand-300" />
    </div>
  );
}

export default AuthPanel;
