import { ChevronLeft } from "lucide-react";

interface PhaseHeaderProps {
  title: string;
  onBack: () => void;
  textColor: string;
}

const PhaseHeader = ({ title, onBack, textColor }: PhaseHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button onClick={onBack} className={`${textColor} hover:opacity-80`}>
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
    </div>
  );
};

export default PhaseHeader;