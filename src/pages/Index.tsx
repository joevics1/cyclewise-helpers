import CycleForm from "@/components/CycleForm";
import MoodTracker from "@/components/mood/MoodTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cycle-purple to-cycle-pink p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cycle-text text-center mb-6">
          Menstrual Cycle Tracker
        </h1>
        <Tabs defaultValue="cycle" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="cycle">Cycle Tracker</TabsTrigger>
            <TabsTrigger value="mood">Mood Tracker</TabsTrigger>
          </TabsList>
          <TabsContent value="cycle">
            <CycleForm />
          </TabsContent>
          <TabsContent value="mood">
            <MoodTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;