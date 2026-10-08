import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { getGuest } from "@/app/_lib/auth";

export const metadata = {
  title: "Guest profile",
};

export default async function Page() {
  const guest = await getGuest();

  return (
    <div>
      <header className="mb-6">
        <h1 className="page-title mb-2">Profile</h1>
        <p className="max-w-2xl font-label text-[0.95rem] text-ink-600">
          The front desk needs these at check-in.
        </p>
      </header>

      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="field"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
}
