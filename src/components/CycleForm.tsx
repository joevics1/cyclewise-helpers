import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    const ovulationStart = addDays(lastPeriod, parseInt(cycleLength) - 19);
    const ovulationEnd = addDays(lastPeriod, parseInt(cycleLength) - 11);
    const fertilePeak = addDays(lastPeriod, parseInt(cycleLength) - 14);

    setResults({
      nextPeriod,
      ovulationStart,
      ovulationEnd,
      fertilePeak,
    });

    setShowResults(true);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-cycle-text">Last Period Start Date</h2>
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          className="rounded-lg border shadow bg-white max-h-[300px]"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-cycle-text">Cycle Length</h2>
        <Select value={cycleLength} onValueChange={setCycleLength}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select cycle length" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 15 }, (_, i) => i + 21).map((days) => (
              <SelectItem key={days} value={days.toString()}>
                {days} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={calculateDates}
        className="w-full bg-cycle-accent hover:bg-cycle-accent/90 text-white"
      >
        Calculate Cycle
      </Button>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Cycle Predictions</DialogTitle>
          </DialogHeader>
          {results && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-cycle-text">Next Period</h3>
                <p>{format(results.nextPeriod, "MMMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cycle-text">Ovulation Window</h3>
                <p>{format(results.ovulationStart, "MMMM d")} - {format(results.ovulationEnd, "MMMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cycle-text">Peak Fertility</h3>
                <p>{format(results.fertilePeak, "MMMM d, yyyy")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CycleForm;