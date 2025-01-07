import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
          <ScrollArea className="h-[calc(100dvh-12rem)]">
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
        </DialogHeader>
        <ScrollArea className="h-[calc(100dvh-8rem)]">
          <div className="space-y-4 p-6">
            {/* Next Period */}
            <div 
              onClick={() => setSelectedPhase("Menstrual")}
              className="bg-[#FFE5EC] rounded-lg p-4 cursor-pointer hover:bg-[#FFE5EC]/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#FF69B4]" />
                    Next Period
                  </h3>
                  <p className="text-lg mt-2">{format(results.nextPeriod, "MMMM d, yyyy")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#FF69B4]" />
              </div>
            </div>

            {/* Ovulation Window */}
            <div 
              onClick={() => setSelectedPhase("Ovulatory")}
              className="bg-[#E5DEFF] rounded-lg p-4 cursor-pointer hover:bg-[#E5DEFF]/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#9B87F5]" />
                    Ovulation Window
                  </h3>
                  <p className="text-lg mt-2">
                    {format(results.ovulationDay, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9B87F5]" />
              </div>
            </div>

            {/* Fertile Window */}
            <div 
              onClick={() => setSelectedPhase("Follicular")}
              className="bg-[#FDE1D3] rounded-lg p-4 cursor-pointer hover:bg-[#FDE1D3]/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#FF8C5A]" />
                    Fertile Window
                  </h3>
                  <p className="text-lg mt-2">
                    {format(results.fertileWindowStart, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#FF8C5A]" />
              </div>
            </div>

            {/* Less Fertile Phase */}
            <div 
              onClick={() => setSelectedPhase("Luteal")}
              className="bg-[#D3E4FD] rounded-lg p-4 cursor-pointer hover:bg-[#D3E4FD]/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#5A9EFF]" />
                    Less Fertile Phase
                  </h3>
                  <p className="text-lg mt-2">
                    {format(results.follicularPhaseStart, "MMMM d")} - {format(results.follicularPhaseEnd, "MMMM d, yyyy")}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#5A9EFF]" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;