import { Icon } from "lucide-react";
import * as icons from "lucide-react";

interface SectionListProps {
  title: string;
  items: string[];
  icon: keyof typeof icons;
  colors: {
    bg: string;
    accent: string;
    text: string;
  };
}

const SectionList = ({ title, items, icon, colors }: SectionListProps) => {
  const IconComponent = icons[icon];
  
  return (
    <div>
      <h4 className={`font-medium flex items-center gap-2 mb-2 ${colors.text}`}>
        <IconComponent className={`w-4 h-4 ${colors.accent}`} />
        {title}
      </h4>
      <ul className={`list-disc pl-5 space-y-1 ${colors.text}/80`}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SectionList;