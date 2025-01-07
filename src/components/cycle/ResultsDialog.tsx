import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import PhaseInsights from "./PhaseInsights";

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: any;
}

const ResultsDialog = ({ open, onOpenChange, results }: ResultsDialogProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  if (!results) return null;

  if (selectedPhase) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full sm:max-w-2xl h-[100dvh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedPhase} Insights
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            onClick={() => setSelectedPhase(null)}
            className="mb-4"
          >
            ← Back to Results
          </Button>
          <ScrollArea className="h-[calc(100dvh-12rem)] scrollbar-hide">
            <PhaseInsights phase={selectedPhase.toLowerCase()} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl h-[100dvh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Your Cycle Predictions
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <ScrollArea className="h-[calc(100dvh-12rem)] scrollbar-hide">
          <div className="space-y-4 p-6">
            {/* Next Period */}
            <div 
              onClick={() => setSelectedPhase("Menstrual")}
              className="bg-phase-menstrual-bg rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-phase-menstrual-text flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-phase-menstrual-accent" />
                    Next Period
                  </h3>
                  <p className="text-sm text-phase-menstrual-text/70 mb-1">
                    {format(results.nextPeriod, "MMMM d, yyyy")}
                  </p>
                  <p className="text-phase-menstrual-text/80">
                    Your next menstrual cycle is expected to begin on this date. Plan accordingly.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-phase-menstrual-accent mt-1" />
              </div>
            </div>

            {/* Ovulation Window */}
            <div 
              onClick={() => setSelectedPhase("Ovulatory")}
              className="bg-phase-ovulatory-bg rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-phase-ovulatory-text flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-phase-ovulatory-accent" />
                    Ovulation Window
                  </h3>
                  <p className="text-sm text-phase-ovulatory-text/70 mb-1">
                    {format(results.ovulationDay, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                  </p>
                  <p className="text-phase-ovulatory-text/80">
                    This is your estimated ovulation period. Your egg is released during this time, making it the peak fertility window.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-phase-ovulatory-accent mt-1" />
              </div>
            </div>

            {/* Fertile Window */}
            <div 
              onClick={() => setSelectedPhase("Follicular")}
              className="bg-phase-follicular-bg rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-phase-follicular-text flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-phase-follicular-accent" />
                    Fertile Window
                  </h3>
                  <p className="text-sm text-phase-follicular-text/70 mb-1">
                    {format(results.fertileWindowStart, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                  </p>
                  <p className="text-phase-follicular-text/80">
                    During this window, you have the highest chance of conception. The days leading up to and including ovulation are your most fertile days.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-phase-follicular-accent mt-1" />
              </div>
            </div>

            {/* Free Period (formerly Less Fertile Phase) */}
            <div 
              onClick={() => setSelectedPhase("Luteal")}
              className="bg-phase-luteal-bg rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-phase-luteal-text flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-phase-luteal-accent" />
                    Free Period
                  </h3>
                  <p className="text-sm text-phase-luteal-text/70 mb-1">
                    {format(results.follicularPhaseStart, "MMMM d")} - {format(results.follicularPhaseEnd, "MMMM d, yyyy")}
                  </p>
                  <p className="text-phase-luteal-text/80">
                    This is your less fertile phase, occurring after your period and before your fertile window. While pregnancy is still possible, it's less likely during this time.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-phase-luteal-accent mt-1" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;