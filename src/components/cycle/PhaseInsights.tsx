import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Heart, 
  Flower2, 
  Moon, 
  Sun, 
  Thermometer,
  Apple,
  Dumbbell
} from "lucide-react";

interface PhaseInfo {
  title: string;
  icon: React.ReactNode;
  description: string;
  symptoms: string[];
  selfCare: string[];
  nutrition: string[];
  exercise: string[];
  colors: {
    bg: string;
    accent: string;
    text: string;
  };
}

const phaseInsights: Record<string, PhaseInfo> = {
  menstrual: {
    title: "Menstrual Phase",
    icon: <Heart className="w-6 h-6 text-phase-menstrual-accent" />,
    description: "Your body is shedding the uterine lining. Energy levels may be lower, and it's important to rest and take care of yourself.",
    symptoms: [
      "Cramping",
      "Fatigue",
      "Lower back pain",
      "Mood changes"
    ],
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
    ],
    colors: {
      bg: "bg-phase-menstrual-bg",
      accent: "text-phase-menstrual-accent",
      text: "text-phase-menstrual-text"
    }
  },
  follicular: {
    title: "Follicular Phase",
    icon: <Sun className="w-6 h-6 text-phase-follicular-accent" />,
    description: "Estrogen levels begin to rise. You may feel more energetic and creative during this time.",
    symptoms: [
      "Increased energy",
      "Better mood",
      "Enhanced creativity",
      "Improved concentration"
    ],
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
    ],
    colors: {
      bg: "bg-phase-follicular-bg",
      accent: "text-phase-follicular-accent",
      text: "text-phase-follicular-text"
    }
  },
  ovulatory: {
    title: "Ovulatory Phase",
    icon: <Flower2 className="w-6 h-6 text-phase-ovulatory-accent" />,
    description: "Peak fertility period. Energy levels and confidence are typically at their highest.",
    symptoms: [
      "Increased libido",
      "Peak energy",
      "Heightened senses",
      "Mild cramping"
    ],
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
    ],
    colors: {
      bg: "bg-phase-ovulatory-bg",
      accent: "text-phase-ovulatory-accent",
      text: "text-phase-ovulatory-text"
    }
  },
  luteal: {
    title: "Free Period",
    icon: <Moon className="w-6 h-6 text-phase-luteal-accent" />,
    description: "Progesterone rises and then drops. You may experience PMS symptoms during this time.",
    symptoms: [
      "Mood swings",
      "Bloating",
      "Food cravings",
      "Fatigue"
    ],
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
    ],
    colors: {
      bg: "bg-phase-luteal-bg",
      accent: "text-phase-luteal-accent",
      text: "text-phase-luteal-text"
    }
  }
};

interface PhaseInsightsProps {
  phase: string;
}

const PhaseInsights = ({ phase }: PhaseInsightsProps) => {
  const info = phaseInsights[phase];
  if (!info) return null;

  return (
    <ScrollArea className="h-full scrollbar-hide">
      <div className={`space-y-6 p-4 ${info.colors.bg}`}>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {info.icon}
                <h3 className={`text-xl font-semibold ${info.colors.text}`}>{info.title}</h3>
              </div>
              
              <p className={`${info.colors.text}/80`}>{info.description}</p>
              
              <div>
                <h4 className={`font-medium flex items-center gap-2 mb-2 ${info.colors.text}`}>
                  <Thermometer className={`w-4 h-4 ${info.colors.accent}`} />
                  Common Symptoms
                </h4>
                <ul className={`list-disc pl-5 space-y-1 ${info.colors.text}/80`}>
                  {info.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-medium flex items-center gap-2 mb-2 ${info.colors.text}`}>
                  <Heart className={`w-4 h-4 ${info.colors.accent}`} />
                  Self-Care Tips
                </h4>
                <ul className={`list-disc pl-5 space-y-1 ${info.colors.text}/80`}>
                  {info.selfCare.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-medium flex items-center gap-2 mb-2 ${info.colors.text}`}>
                  <Apple className={`w-4 h-4 ${info.colors.accent}`} />
                  Nutrition Recommendations
                </h4>
                <ul className={`list-disc pl-5 space-y-1 ${info.colors.text}/80`}>
                  {info.nutrition.map((food, index) => (
                    <li key={index}>{food}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-medium flex items-center gap-2 mb-2 ${info.colors.text}`}>
                  <Dumbbell className={`w-4 h-4 ${info.colors.accent}`} />
                  Exercise Suggestions
                </h4>
                <ul className={`list-disc pl-5 space-y-1 ${info.colors.text}/80`}>
                  {info.exercise.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="disclaimer">
                  <AccordionTrigger className={`${info.colors.text}`}>
                    Important Disclaimer
                  </AccordionTrigger>
                  <AccordionContent className={`${info.colors.text}/80`}>
                    This information is for general guidance only and should not be considered medical advice. Every person's cycle is unique, and predictions are estimates based on average cycle lengths. Please consult with a healthcare provider for personalized medical advice.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default PhaseInsights;