interface BadgeProps {
  children: React.ReactNode;
  variant: 'running' | 'low' | 'depleted' | 'in' | 'out' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant, size = 'md' }: BadgeProps) {
  const variants = {
    running: 'bg-green-100 text-green-800 border-green-200',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    depleted: 'bg-red-100 text-red-800 border-red-200',
    in: 'bg-blue-100 text-blue-800 border-blue-200',
    out: 'bg-purple-100 text-purple-800 border-purple-200',
    info: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {variant === 'running' && '🟢'}
      {variant === 'low' && '🟡'}
      {variant === 'depleted' && '🔴'}
      {children}
    </span>
  );
}
