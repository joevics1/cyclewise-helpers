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
import { useToast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("28");
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

    toast({
      title: "Cycle dates calculated!",
      description: "Your predictions have been updated.",
    });

    return { nextPeriod, ovulationStart, ovulationEnd, fertilePeak };
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-cycle-text">Last Period Start Date</h2>
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          className="rounded-lg border shadow bg-white"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-cycle-text">Cycle Length</h2>
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
    </div>
  );
};

export default CycleForm;