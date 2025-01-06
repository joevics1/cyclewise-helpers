import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info, X } from "lucide-react";
import { format } from "date-fns";

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: any;
}

const ResultsDialog = ({ open, onOpenChange, results }: ResultsDialogProps) => {
  if (!results) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Your Cycle Predictions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* Next Period */}
              <div className="bg-[#FFE5EC] p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#FF69B4]" />
                  Next Period
                </h3>
                <p className="text-lg mt-2">{format(results.nextPeriod, "MMMM d, yyyy")}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your next menstrual cycle is expected to begin on this date. Plan accordingly.
                </p>
              </div>

              {/* Ovulation Window */}
              <div className="bg-[#E5DEFF] p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#9B87F5]" />
                  Ovulation Window
                </h3>
                <p className="text-lg mt-2">
                  {format(results.ovulationDay, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This is your estimated ovulation period. Your egg is released during this time, making it the peak fertility window.
                </p>
              </div>

              {/* Fertile Window */}
              <div className="bg-[#FDE1D3] p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#FF8C5A]" />
                  Fertile Window
                </h3>
                <p className="text-lg mt-2">
                  {format(results.fertileWindowStart, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  During this window, you have the highest chance of conception. The days leading up to and including ovulation are your most fertile days.
                </p>
              </div>

              {/* Less Fertile Phase */}
              <div className="bg-[#D3E4FD] p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#5A9EFF]" />
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
              <AccordionItem value="disclaimer" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold text-gray-700 hover:no-underline">
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

            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-white mt-4"
            >
              Close
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;