import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}

const phaseInsights: Record<string, PhaseInfo> = {
  menstrual: {
    title: "Menstrual Phase",
    icon: <Heart className="w-6 h-6 text-red-500" />,
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
    ]
  },
  follicular: {
    title: "Follicular Phase",
    icon: <Sun className="w-6 h-6 text-yellow-500" />,
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
    ]
  },
  ovulatory: {
    title: "Ovulatory Phase",
    icon: <Flower2 className="w-6 h-6 text-pink-500" />,
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
    ]
  },
  luteal: {
    title: "Luteal Phase",
    icon: <Moon className="w-6 h-6 text-purple-500" />,
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
    ]
  }
};

interface PhaseInsightsProps {
  phase: string;
}

const PhaseInsights = ({ phase }: PhaseInsightsProps) => {
  const info = phaseInsights[phase];
  if (!info) return null;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {info.icon}
                <h3 className="text-xl font-semibold">{info.title}</h3>
              </div>
              
              <p className="text-muted-foreground">{info.description}</p>
              
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4" />
                  Common Symptoms
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {info.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4" />
                  Self-Care Tips
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {info.selfCare.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4" />
                  Nutrition Recommendations
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {info.nutrition.map((food, index) => (
                    <li key={index}>{food}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4" />
                  Exercise Suggestions
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {info.exercise.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default PhaseInsights;
