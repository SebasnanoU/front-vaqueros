import { h } from 'preact';

interface Props {
  value: number;
  onChange?: (v: number) => void;
}

export function StarRating({ value, onChange }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div>
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => onChange && onChange(s)}
          style={{ cursor: onChange ? 'pointer' : 'default', color: s <= value ? '#ff0' : '#999', fontSize: '24px' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
