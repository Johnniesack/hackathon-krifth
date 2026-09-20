export default function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">Dashboard</p>
          <h1>{title}</h1>
        </div>
      </header>
      <div className="db-empty">
        <strong>Coming soon</strong>
        <p>{note}</p>
      </div>
    </>
  );
}
