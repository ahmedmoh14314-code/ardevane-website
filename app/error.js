"use client";

import Message from "./_components/Message";

export default function Error({ error, reset }) {
  return (
    <Message eyebrow="Something went wrong" title={error.message}>
      <button className="btn-primary" onClick={reset}>
        Try again
      </button>
    </Message>
  );
}
