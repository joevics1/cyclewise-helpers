import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface CycleLengthSelectorProps {
  cycleLength: string;
  setCycleLength: (length: string) => void;
}

const CycleLengthSelector = ({ cycleLength, setCycleLength }: CycleLengthSelectorProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cycleLengths = Array.from({ length: 15 }, (_, i) => i + 21);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-cycle-text">Cycle Length</h2>
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cycleLengths.map((days) => (
          <Button
            key={days}
            variant={cycleLength === days.toString() ? "default" : "outline"}
            onClick={() => setCycleLength(days.toString())}
            className={`min-w-[60px] snap-center ${
              cycleLength === days.toString()
                ? "bg-[#FF69B4] text-white hover:bg-[#FF69B4]/90"
                : "bg-[#FFE5EC] hover:bg-[#FFE5EC]/90 text-[#FF69B4]"
            }`}
          >
            {days}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CycleLengthSelector;