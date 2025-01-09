import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionList from "./SectionList";

interface PhaseContentProps {
  icon: LucideIcon;  // Changed from Icon to LucideIcon
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

const PhaseContent = ({
  icon: IconComponent,
  description,
  symptoms,
  selfCare,
  nutrition,
  exercise,
  colors,
}: PhaseContentProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconComponent className={`w-6 h-6 ${colors.accent}`} />
            <p className={`${colors.text}/80`}>{description}</p>
          </div>
          
          <SectionList 
            title="Common Symptoms"
            items={symptoms}
            iconName="Thermometer"
            colors={colors}
          />
          
          <SectionList 
            title="Self-Care Tips"
            items={selfCare}
            iconName="Heart"
            colors={colors}
          />
          
          <SectionList 
            title="Nutrition Recommendations"
            items={nutrition}
            iconName="Apple"
            colors={colors}
          />
          
          <SectionList 
            title="Exercise Suggestions"
            items={exercise}
            iconName="Dumbbell"
            colors={colors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhaseContent;