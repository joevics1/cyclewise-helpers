import CycleForm from "@/components/CycleForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cycle-purple to-cycle-pink p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cycle-text text-center mb-6">
          Menstrual Cycle Tracker
        </h1>
        <CycleForm />
      </div>
    </div>
  );
};

export default Index;