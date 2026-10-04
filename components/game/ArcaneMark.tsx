export default function ArcaneMark({ label, index }: { label: string; index: string }) {
  return <div className="arcane-signature"><span aria-hidden="true">⌖ ◇ ⌁</span><span>{label}</span><span>{index}</span></div>;
}
