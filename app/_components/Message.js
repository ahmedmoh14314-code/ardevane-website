// The one look for "not found", "something went wrong" and similar pages
function Message({ eyebrow, title, children }) {
  return (
    <div className="page flex justify-center">
      <div className="card w-full max-w-lg animate-rise p-10 text-center">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="mb-6 font-display text-3xl text-forest-950">{title}</h1>
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

export default Message;
