import Link from "next/link";
import Message from "./_components/Message";

function NotFound() {
  return (
    <Message eyebrow="Page not found" title="This page has wandered off">
      <Link href="/" className="btn-primary">
        Back to the home page
      </Link>
    </Message>
  );
}

export default NotFound;
