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
import { addDays, format, subDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

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
    const ovulationDay = subDays(nextPeriod, 14); // Ovulation typically occurs 14 days before next period
    const fertileWindowStart = subDays(ovulationDay, 5); // Fertile window starts 5 days before ovulation
    const fertileWindowEnd = addDays(ovulationDay, 1); // Fertile window ends 1 day after ovulation
    const follicularPhaseStart = addDays(lastPeriod, 5); // Follicular phase starts after period ends (assuming 5-day period)
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Your Cycle Predictions</DialogTitle>
          </DialogHeader>
          {results && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {/* Next Period */}
                <div className="bg-cycle-purple p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-cycle-accent" />
                    Next Period
                  </h3>
                  <p className="text-lg mt-2">{format(results.nextPeriod, "MMMM d, yyyy")}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your next menstrual cycle is expected to begin on this date. Plan accordingly.
                  </p>
                </div>

                {/* Fertile Window */}
                <div className="bg-cycle-pink p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-cycle-accent" />
                    Fertile Window
                  </h3>
                  <p className="text-lg mt-2">
                    {format(results.fertileWindowStart, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    This is your most fertile period. Peak fertility occurs around {format(results.ovulationDay, "MMMM d")}.
                  </p>
                </div>

                {/* Follicular Phase */}
                <div className="bg-white p-4 rounded-lg border border-cycle-accent/20">
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-cycle-accent" />
                    Follicular Phase (Less Fertile)
                  </h3>
                  <p className="text-lg mt-2">
                    {format(results.follicularPhaseStart, "MMMM d")} - {format(results.follicularPhaseEnd, "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    This is your less fertile phase, occurring after your period and before your fertile window.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="font-semibold mb-2">Important Disclaimer:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>These predictions are estimates based on average cycle lengths and patterns.</li>
                  <li>Many factors can affect your cycle, including stress, diet, and health conditions.</li>
                  <li>This tool should not be used as a sole method of family planning or contraception.</li>
                  <li>Consult with a healthcare provider for medical advice and family planning options.</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CycleForm;