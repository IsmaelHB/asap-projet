import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
      <Loader2 className="h-8 w-8 animate-spin text-doctolib-blue mb-3" />
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
