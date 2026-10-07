import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="grid justify-center text-center">
      <Spinner />
      <p className="text-ink-500">Loading the cabins…</p>
    </div>
  );
}
