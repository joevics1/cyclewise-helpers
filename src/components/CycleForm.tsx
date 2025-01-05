import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, subDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("28");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const cycleLengths = Array.from({ length: 15 }, (_, i) => i + 21);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - 100)
      : Math.min((cycleLengths.length * 60) - 300, scrollPosition + 100);
    setScrollPosition(newPosition);
  };

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
        <div className="relative flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="overflow-hidden mx-8">
            <div 
              className="flex gap-2 transition-transform duration-300"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {cycleLengths.map((days) => (
                <Button
                  key={days}
                  variant={cycleLength === days.toString() ? "default" : "outline"}
                  onClick={() => setCycleLength(days.toString())}
                  className="min-w-[60px] bg-white hover:bg-cycle-accent/10"
                >
                  {days}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button 
        onClick={calculateDates}
        className="w-full bg-cycle-accent hover:bg-cycle-accent/90 text-white"
      >
        Calculate Cycle
      </Button>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Your Cycle Predictions</DialogTitle>
          </DialogHeader>
          {results && (
            <ScrollArea className="pr-4">
              <div className="space-y-4">
                <div className="grid gap-4">
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

                  {/* Ovulation Day */}
                  <div className="bg-cycle-pink p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                      <Info className="w-5 h-5 text-cycle-accent" />
                      Ovulation Day
                    </h3>
                    <p className="text-lg mt-2">{format(results.ovulationDay, "MMMM d, yyyy")}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      This is your estimated ovulation day. You're most fertile on this day and the day before.
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
                      During this window, you have the highest chance of conception. The days leading up to and including ovulation are your most fertile days.
                    </p>
                  </div>

                  {/* Follicular Phase */}
                  <div className="bg-white p-4 rounded-lg border border-cycle-accent/20">
                    <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                      <Info className="w-5 h-5 text-cycle-accent" />
                      Less Fertile Phase
                    </h3>
                    <p className="text-lg mt-2">
                      {format(results.follicularPhaseStart, "MMMM d")} - {format(results.follicularPhaseEnd, "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This is your less fertile phase, occurring after your period and before your fertile window. While pregnancy is still possible, it's less likely during this time.
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="disclaimer">
                    <AccordionTrigger className="text-sm font-semibold text-gray-700">
                      Important Disclaimer
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-semibold">Please note:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>These predictions are estimates based on average cycle lengths and patterns.</li>
                          <li>Many factors can affect your cycle, including stress, diet, and health conditions.</li>
                          <li>This tool should not be used as a sole method of family planning or contraception.</li>
                          <li>The fertile window and ovulation predictions are approximate and may vary.</li>
                          <li>Consult with a healthcare provider for medical advice and family planning options.</li>
                          <li>Track your cycle over several months for more accurate predictions.</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CycleForm;