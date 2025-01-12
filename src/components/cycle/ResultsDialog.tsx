import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, ChevronRight } from "lucide-react";
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
        <DialogContent className="max-w-full sm:max-w-2xl h-[100dvh] p-0">
          <ScrollArea className="h-full scrollbar-hide">
            <div className="p-4">
              <PhaseInsights 
                phase={selectedPhase.toLowerCase()} 
                onBack={() => setSelectedPhase(null)}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl h-[100dvh] px-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Your Cycle Predictions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100dvh-8rem)] scrollbar-hide">
          <div className="space-y-3">
            <PhaseCard
              title="Next Period"
              date={format(results.nextPeriod, "MMMM d, yyyy")}
              description="Your next menstrual cycle is expected to begin on this date. Plan accordingly."
              phase="menstrual"
              onClick={() => setSelectedPhase("Menstrual")}
            />

            <PhaseCard
              title="Ovulation Window"
              date={`${format(results.ovulationDay, "MMMM d")} - ${format(results.fertileWindowEnd, "MMMM d, yyyy")}`}
              description="This is your estimated ovulation period. Your egg is released during this time, making it the peak fertility window."
              phase="ovulatory"
              onClick={() => setSelectedPhase("Ovulatory")}
            />

            <PhaseCard
              title="Fertile Window"
              date={`${format(results.fertileWindowStart, "MMMM d")} - ${format(results.fertileWindowEnd, "MMMM d, yyyy")}`}
              description="During this window, you have the highest chance of conception. The days leading up to and including ovulation are your most fertile days."
              phase="follicular"
              onClick={() => setSelectedPhase("Follicular")}
            />

            <PhaseCard
              title="Free Period"
              date={`${format(results.follicularPhaseStart, "MMMM d")} - ${format(results.follicularPhaseEnd, "MMMM d, yyyy")}`}
              description="This is your less fertile phase, occurring after your period and before your fertile window. While pregnancy is still possible, it's less likely during this time."
              phase="luteal"
              onClick={() => setSelectedPhase("Luteal")}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface PhaseCardProps {
  title: string;
  date: string;
  description: string;
  phase: "menstrual" | "ovulatory" | "follicular" | "luteal";
  onClick: () => void;
}

const PhaseCard = ({ title, date, description, phase, onClick }: PhaseCardProps) => (
  <div 
    onClick={onClick}
    className={`bg-phase-${phase}-bg rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className={`font-semibold text-lg text-phase-${phase}-text flex items-center gap-2 mb-1`}>
          <Info className={`w-5 h-5 text-phase-${phase}-accent`} />
          {title}
        </h3>
        <p className={`text-lg font-medium text-phase-${phase}-text/90 mb-1`}>
          {date}
        </p>
        <p className={`text-phase-${phase}-text/80 text-sm`}>
          {description}
        </p>
      </div>
      <ChevronRight className={`w-10 h-10 text-phase-${phase}-accent mt-1`} />
    </div>
  </div>
);

export default ResultsDialog;