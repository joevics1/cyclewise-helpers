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
import { Info, ChevronDown, Heart, Flower2, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: any;
}

const phaseInsights = {
  menstrual: {
    icon: <Heart className="w-5 h-5 text-red-500" />,
    title: "Menstrual Phase Insights",
    description: "Your body is shedding the uterine lining. Energy levels may be lower.",
    selfCare: [
      "Rest and relaxation",
      "Warm baths",
      "Gentle stretching",
      "Meditation"
    ],
    nutrition: [
      "Iron-rich foods",
      "Dark chocolate",
      "Warm, comforting foods",
      "Stay hydrated"
    ],
    exercise: [
      "Light walking",
      "Gentle yoga",
      "Swimming",
      "Stretching"
    ]
  },
  follicular: {
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    title: "Follicular Phase Insights",
    description: "Estrogen levels begin to rise. You may feel more energetic and creative.",
    selfCare: [
      "Start new projects",
      "Social activities",
      "Learning new skills",
      "Creative pursuits"
    ],
    nutrition: [
      "Lean proteins",
      "Fresh vegetables",
      "Fermented foods",
      "Seeds"
    ],
    exercise: [
      "High-intensity workouts",
      "Strength training",
      "Dance classes",
      "Running"
    ]
  },
  ovulatory: {
    icon: <Flower2 className="w-5 h-5 text-pink-500" />,
    title: "Ovulatory Phase Insights",
    description: "Peak fertility period. Energy levels and confidence are typically highest.",
    selfCare: [
      "Social connections",
      "Communication",
      "Self-expression",
      "Dating"
    ],
    nutrition: [
      "Antioxidant-rich foods",
      "Cruciferous vegetables",
      "Healthy fats",
      "Light meals"
    ],
    exercise: [
      "Group fitness classes",
      "Team sports",
      "HIIT workouts",
      "Power yoga"
    ]
  },
  luteal: {
    icon: <Moon className="w-5 h-5 text-purple-500" />,
    title: "Luteal Phase Insights",
    description: "Progesterone rises and then drops. You may experience PMS symptoms.",
    selfCare: [
      "Journaling",
      "Stress management",
      "Extra sleep",
      "Comfort activities"
    ],
    nutrition: [
      "Complex carbohydrates",
      "Magnesium-rich foods",
      "Calcium-rich foods",
      "Avoid caffeine"
    ],
    exercise: [
      "Pilates",
      "Low-impact cardio",
      "Walking",
      "Restorative yoga"
    ]
  }
};

const PhaseInsightContent = ({ phase }: { phase: keyof typeof phaseInsights }) => {
  const insight = phaseInsights[phase];
  return (
    <div className="space-y-4 p-4 bg-white/50 rounded-lg">
      <div className="flex items-center gap-2">
        {insight.icon}
        <h4 className="font-semibold">{insight.title}</h4>
      </div>
      <p className="text-sm text-gray-600">{insight.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h5 className="font-medium mb-2">Self Care</h5>
          <ul className="text-sm space-y-1">
            {insight.selfCare.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-2">Nutrition</h5>
          <ul className="text-sm space-y-1">
            {insight.nutrition.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-2">Exercise</h5>
          <ul className="text-sm space-y-1">
            {insight.exercise.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ResultsDialog = ({ open, onOpenChange, results }: ResultsDialogProps) => {
  if (!results) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl h-[100dvh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Your Cycle Predictions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100dvh-8rem)] px-6">
          <div className="space-y-4 pb-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {/* Next Period */}
              <AccordionItem value="period" className="border-0">
                <div className="bg-[#FFE5EC] rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#FF69B4]" />
                        Next Period
                      </h3>
                      <p className="text-lg mt-2">{format(results.nextPeriod, "MMMM d, yyyy")}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <PhaseInsightContent phase="menstrual" />
                  </AccordionContent>
                </div>
              </AccordionItem>

              {/* Ovulation Window */}
              <AccordionItem value="ovulation" className="border-0">
                <div className="bg-[#E5DEFF] rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#9B87F5]" />
                        Ovulation Window
                      </h3>
                      <p className="text-lg mt-2">
                        {format(results.ovulationDay, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <PhaseInsightContent phase="ovulatory" />
                  </AccordionContent>
                </div>
              </AccordionItem>

              {/* Fertile Window */}
              <AccordionItem value="fertile" className="border-0">
                <div className="bg-[#FDE1D3] rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#FF8C5A]" />
                        Fertile Window
                      </h3>
                      <p className="text-lg mt-2">
                        {format(results.fertileWindowStart, "MMMM d")} - {format(results.fertileWindowEnd, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <PhaseInsightContent phase="follicular" />
                  </AccordionContent>
                </div>
              </AccordionItem>

              {/* Less Fertile Phase */}
              <AccordionItem value="lessFertile" className="border-0">
                <div className="bg-[#D3E4FD] rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-cycle-text flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#5A9EFF]" />
                        Less Fertile Phase
                      </h3>
                      <p className="text-lg mt-2">
                        {format(results.follicularPhaseStart, "MMMM d")} - {format(results.follicularPhaseEnd, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <PhaseInsightContent phase="luteal" />
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>

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
          </div>
        </ScrollArea>
        <div className="p-6 sticky bottom-0 bg-white border-t">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;