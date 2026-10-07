import {
  EyeSlashIcon,
  FireIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import TextExpander from "@/app/_components/TextExpander";
import CabinGallery from "./CabinGallery";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";

function Cabin({ cabin, images }) {
  const { name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  // Cabins added before the gallery existed only have their cover photo
  const photos = images.length ? images.map((img) => img.url) : [image];

  const features = [
    { icon: UsersIcon, text: `Sleeps up to ${maxCapacity} guests` },
    { icon: FireIcon, text: "Fireplace, private deck and hot tub" },
    { icon: EyeSlashIcon, text: "Fully private, no neighbours in sight" },
  ];

  return (
    <article className="grid animate-rise gap-10 lg:grid-cols-[3fr_2fr]">
      <CabinGallery photos={photos} name={name} />

      <div className="flex flex-col">
        <h1 className="page-title mb-4">Cabin {name}</h1>

        <p className="mb-6">
          <span className="text-3xl font-semibold text-ink-800">
            {formatCurrency(getNightlyPrice(cabin))}
          </span>
          <span className="text-ink-500"> / night</span>
          {discount > 0 && (
            <>
              <s className="ml-3 text-ink-400">{formatCurrency(regularPrice)}</s>
              <span className="ml-3 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                Save {formatCurrency(discount)} a night
              </span>
            </>
          )}
        </p>

        {description && (
          <p className="mb-8 leading-relaxed text-ink-600">
            <TextExpander>{description}</TextExpander>
          </p>
        )}

        <ul className="mb-8 space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-ink-700">{text}</span>
            </li>
          ))}
        </ul>

        <a href="#reserve" className="btn-primary self-start px-8">
          Check available dates
        </a>
      </div>
    </article>
  );
}

export default Cabin;
