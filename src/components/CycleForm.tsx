import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, subDays } from "date-fns";
import CycleLengthSelector from "./cycle/CycleLengthSelector";
import ResultsDialog from "./cycle/ResultsDialog";

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("28");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const calculateDates = () => {
    if (!lastPeriod) {
      toast({
        title: "Please select your last period start date",
        variant: "destructive",
      });
      return;
    }

    const nextPeriod = addDays(lastPeriod, parseInt(cycleLength));
    const ovulationDay = subDays(nextPeriod, 14);
    const fertileWindowStart = subDays(ovulationDay, 5);
    const fertileWindowEnd = addDays(ovulationDay, 1);
    const follicularPhaseStart = addDays(lastPeriod, 5);
    const follicularPhaseEnd = subDays(fertileWindowStart, 1);

    setResults({
      nextPeriod,
      ovulationDay,
      fertileWindowStart,
      fertileWindowEnd,
      follicularPhaseStart,
      follicularPhaseEnd,
    });

    setShowResults(true);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-cycle-text">Last Period Start Date</h2>
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          className="rounded-lg border shadow bg-[#F1F0FB] max-h-[300px]"
        />
      </div>

      <CycleLengthSelector cycleLength={cycleLength} setCycleLength={setCycleLength} />

      <Button 
        onClick={calculateDates}
        className="w-full bg-cycle-accent hover:bg-cycle-accent/90 text-white"
      >
        Calculate Cycle
      </Button>

      <ResultsDialog 
        open={showResults} 
        onOpenChange={setShowResults}
        results={results}
      />
    </div>
  );
};

export default CycleForm;