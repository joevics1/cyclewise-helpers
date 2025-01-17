import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, subDays } from "date-fns";
import CycleLengthSelector from "./cycle/CycleLengthSelector";
import ResultsDialog from "./cycle/ResultsDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationPreferences {
  beforePeriod: boolean;
  onPeriodStart: boolean;
  ovulation: boolean;
  reminderDays: string;
}

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("31");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    beforePeriod: true,
    onPeriodStart: true,
    ovulation: false,
    reminderDays: "7",
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.lastPeriod) setLastPeriod(new Date(parsed.lastPeriod));
      if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
      if (parsed.notificationsEnabled) setNotificationsEnabled(parsed.notificationsEnabled);
      if (parsed.notificationPrefs) setNotificationPrefs(parsed.notificationPrefs);
    }
  }, []);

  useEffect(() => {
    if (lastPeriod || cycleLength !== "28" || notificationsEnabled) {
      localStorage.setItem('cycleData', JSON.stringify({
        lastPeriod,
        cycleLength,
        notificationsEnabled,
        notificationPrefs
      }));
    }
  }, [lastPeriod, cycleLength, notificationsEnabled, notificationPrefs]);

  const calculateDates = () => {
    if (!lastPeriod) {
      toast({
        title: "Please select your last period start date",
        variant: "destructive",
      });
      return;
    }

    const nextPeriod = addDays(lastPeriod, parseInt(cycleLength));
    const ovulationDay = subDays(nextPeriod, 14);
    const fertileWindowStart = subDays(ovulationDay, 5);
    const fertileWindowEnd = addDays(ovulationDay, 1);
    const follicularPhaseStart = addDays(lastPeriod, 5);
    const follicularPhaseEnd = subDays(fertileWindowStart, 1);

    setResults({
      nextPeriod,
      ovulationDay,
      fertileWindowStart,
      fertileWindowEnd,
      follicularPhaseStart,
      follicularPhaseEnd,
    });

    // Schedule browser notifications if enabled
    if (notificationsEnabled && "Notification" in window) {
      scheduleNotifications(nextPeriod, ovulationDay);
    }

    setShowResults(true);
  };

  const scheduleNotifications = async (nextPeriod: Date, ovulationDay: Date) => {
    if (!notificationsEnabled || !("Notification" in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Schedule notifications using setTimeout
        if (notificationPrefs.beforePeriod) {
          const daysBefore = subDays(nextPeriod, parseInt(notificationPrefs.reminderDays));
          if (daysBefore > new Date()) {
            setTimeout(() => {
              new Notification("Period Reminder", {
                body: `Your period is expected in ${notificationPrefs.reminderDays} days. Prepare accordingly!`,
              });
            }, daysBefore.getTime() - Date.now());
          }
        }

        if (notificationPrefs.onPeriodStart && nextPeriod > new Date()) {
          setTimeout(() => {
            new Notification("Period Start", {
              body: "Your period starts today. Stay prepared!",
            });
          }, nextPeriod.getTime() - Date.now());
        }

        if (notificationPrefs.ovulation && ovulationDay > new Date()) {
          setTimeout(() => {
            new Notification("Ovulation Day", {
              body: "Your ovulation is expected today. This is your most fertile day.",
            });
          }, ovulationDay.getTime() - Date.now());
        }
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      toast({
        title: "Failed to schedule notifications",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You'll receive reminders about your cycle",
        });
      } else {
        toast({
          title: "Notifications permission denied",
          description: "Enable notifications in your browser settings to receive alerts",
          variant: "destructive",
        });
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(checked);
    }
  };

  const hasStoredData = Boolean(localStorage.getItem('cycleData'));

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-cycle-text">Last Period Start Date</h2>
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          disabled={(date) => date > new Date() || date < subDays(new Date(), 90)}
          className="rounded-lg border shadow bg-[#F1F0FB] w-full"
        />
      </div>

      <CycleLengthSelector cycleLength={cycleLength} setCycleLength={setCycleLength} />

      <Button 
        onClick={calculateDates}
        className="w-full bg-cycle-accent hover:bg-cycle-accent/90 text-white"
      >
        {hasStoredData ? 'View Insights' : 'Calculate Cycle'}
      </Button>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#FFE5EC] p-4 rounded-lg cursor-pointer"
             onClick={() => setShowNotificationOptions(!showNotificationOptions)}>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#FF69B4]" />
            <Label htmlFor="notifications" className="flex-1">Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              onClick={(e) => e.stopPropagation()}
            />
            {showNotificationOptions ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </div>
        </div>

        {notificationsEnabled && showNotificationOptions && (
          <div className="space-y-3 bg-[#FFE5EC] p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id="beforePeriod"
                checked={notificationPrefs.beforePeriod}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, beforePeriod: checked }))
                }
              />
              <Label htmlFor="beforePeriod">Notify before period</Label>
            </div>

            {notificationPrefs.beforePeriod && (
              <Select
                value={notificationPrefs.reminderDays}
                onValueChange={(value) => 
                  setNotificationPrefs(prev => ({ ...prev, reminderDays: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select days before" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="5">5 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="periodStart"
                checked={notificationPrefs.onPeriodStart}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, onPeriodStart: checked }))
                }
              />
              <Label htmlFor="periodStart">Notify on period start</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ovulation"
                checked={notificationPrefs.ovulation}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, ovulation: checked }))
                }
              />
              <Label htmlFor="ovulation">Notify on ovulation day</Label>
            </div>
          </div>
        )}
      </div>

      <ResultsDialog 
        open={showResults} 
        onOpenChange={setShowResults}
        results={results}
      />
    </div>
  );
};

export default CycleForm;