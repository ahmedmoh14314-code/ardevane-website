import Link from "next/link";
import Message from "@/app/_components/Message";

function NotFound() {
  return (
    <Message eyebrow="Cabin not found" title="This cabin is not open for booking">
      <Link href="/cabins" className="btn-primary">
        See the open cabins
      </Link>
    </Message>
  );
}

export default NotFound;
