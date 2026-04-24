import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { mockBookings } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { isPast, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Calendar, MapPin, Clock, Users, ArrowLeft, Utensils, Accessibility, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MealOption, ServiceOption } from "@/lib/types";

export default function ManageDetail() {
  const [match, params] = useRoute("/manage/:pnr");
  const pnr = params?.pnr?.toUpperCase();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const booking = mockBookings.find(b => b.pnr === pnr);
  
  const globalSelections = useAppStore(state => state.selections);
  const updateMeal = useAppStore(state => state.updateMeal);
  const toggleService = useAppStore(state => state.toggleService);
  
  const [localSelections, setLocalSelections] = useState<Record<string, { meal?: MealOption, services: ServiceOption[] }>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (booking && pnr) {
      const savedSelections = globalSelections[pnr] || {};
      const initialLocal: Record<string, { meal?: MealOption, services: ServiceOption[] }> = {};
      booking.passengers.forEach(p => {
        initialLocal[p.id] = {
          meal: savedSelections[p.id]?.meal,
          services: [...(savedSelections[p.id]?.services || [])]
        };
      });
      setLocalSelections(initialLocal);
      setHasChanges(false);
    }
  }, [booking, pnr, globalSelections]);

  if (!match || !pnr || !booking) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
        <Button onClick={() => setLocation('/lookup')}>Go to Lookup</Button>
      </div>
    );
  }

  const isLocked = isPast(new Date(booking.editableUntil));

  const handleMealChange = (passengerId: string, meal: MealOption) => {
    if (isLocked) return;
    setLocalSelections(prev => ({
      ...prev,
      [passengerId]: { ...prev[passengerId], meal }
    }));
    setHasChanges(true);
  };

  const handleToggleService = (passengerId: string, service: ServiceOption) => {
    if (isLocked) return;
    setLocalSelections(prev => {
      const currentServices = prev[passengerId]?.services || [];
      const newServices = currentServices.includes(service)
        ? currentServices.filter(s => s !== service)
        : [...currentServices, service];
      
      return {
        ...prev,
        [passengerId]: { ...prev[passengerId], services: newServices }
      };
    });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (isLocked) {
      toast({
        title: "Booking Locked",
        description: "Changes are no longer allowed for this booking.",
        variant: "destructive"
      });
      return;
    }
    
    // Save to store
    Object.entries(localSelections).forEach(([passengerId, selections]) => {
      if (selections.meal) {
        updateMeal(pnr, passengerId, selections.meal);
      }
      
      // Update services by matching with global state
      const currentGlobalServices = globalSelections[pnr]?.[passengerId]?.services || [];
      
      // Add new ones
      selections.services.forEach(s => {
        if (!currentGlobalServices.includes(s)) toggleService(pnr, passengerId, s);
      });
      
      // Remove missing ones
      currentGlobalServices.forEach(s => {
        if (!selections.services.includes(s)) toggleService(pnr, passengerId, s);
      });
    });
    
    setHasChanges(false);
    toast({
      title: "Changes Saved",
      description: "Your preferences have been successfully updated.",
    });
  };

  const mealOptions: { value: MealOption, label: string }[] = [
    { value: "non-vegetarian", label: "Standard (Non-Vegetarian)" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "kosher", label: "Kosher" },
    { value: "jain", label: "Jain" }
  ];

  const serviceOptions: { value: ServiceOption, label: string, desc: string }[] = [
    { value: "wheelchair", label: "Wheelchair Assistance", desc: "Assistance to and from the aircraft" },
    { value: "extra-legroom", label: "Extra Legroom", desc: "Subject to availability at check-in" },
    { value: "priority-boarding", label: "Priority Boarding", desc: "Board the aircraft earlier" },
    { value: "medical", label: "Medical Assistance", desc: "Requires clearance before flight" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 -ml-4" onClick={() => setLocation('/manage')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bookings
      </Button>

      {/* Header Card */}
      <Card className="mb-8 border-border overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">Booking {booking.pnr}</h1>
              <p className="text-primary-foreground/80 mt-1">{booking.airline} {booking.flightNumber} • {booking.aircraft}</p>
            </div>
            <div>
              {isLocked ? (
                <Badge variant="secondary" className="bg-white/20 text-white border-none flex items-center gap-1.5 px-3 py-1">
                  <Lock className="w-3 h-3" /> Locked
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-3 py-1">
                  Editable
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold">{booking.origin.code}</div>
                <div className="text-sm text-primary-foreground/80">{booking.origin.city}</div>
                <div className="text-xs font-medium mt-1">{format(new Date(booking.departure), "MMM d, HH:mm")}</div>
              </div>
              <div className="hidden md:flex flex-col items-center px-8 text-primary-foreground/50">
                <Plane className="w-6 h-6 mb-1" />
                <div className="w-24 h-[1px] bg-primary-foreground/30 relative">
                  <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary-foreground/50" />
                  <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary-foreground/50" />
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold">{booking.destination.code}</div>
                <div className="text-sm text-primary-foreground/80">{booking.destination.city}</div>
                <div className="text-xs font-medium mt-1">{format(new Date(booking.arrival), "MMM d, HH:mm")}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {isLocked && (
        <div className="bg-muted p-4 rounded-lg flex items-start gap-3 mb-8 border border-border">
          <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Booking Locked</h4>
            <p className="text-sm text-muted-foreground">The modification cutoff time has passed. Meals and special services can no longer be updated online.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 space-x-6">
          <TabsTrigger 
            value="meals" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3"
          >
            <Utensils className="w-4 h-4 mr-2" /> Meals
          </TabsTrigger>
          <TabsTrigger 
            value="services"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3"
          >
            <Accessibility className="w-4 h-4 mr-2" /> Special Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-6">
          {booking.passengers.map(passenger => (
            <Card key={passenger.id} className="border-border">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{passenger.name}</span>
                  <span className="text-sm text-muted-foreground font-normal">Seat {passenger.seat}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {mealOptions.map(option => {
                    const isSelected = localSelections[passenger.id]?.meal === option.value;
                    return (
                      <div 
                        key={option.value}
                        onClick={() => handleMealChange(passenger.id, option.value)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:border-primary/50'}
                          ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground'}`}>
                            {isSelected && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {booking.passengers.map(passenger => (
            <Card key={passenger.id} className="border-border">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{passenger.name}</span>
                  <span className="text-sm text-muted-foreground font-normal">Seat {passenger.seat}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceOptions.map(option => {
                    const isSelected = localSelections[passenger.id]?.services?.includes(option.value);
                    return (
                      <div 
                        key={option.value}
                        onClick={() => handleToggleService(passenger.id, option.value)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3
                          ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:border-primary/50'}
                          ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}
                        `}
                      >
                        <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground bg-background'}`}>
                          {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm leading-none mb-1.5">{option.label}</h4>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {!isLocked && (
        <div className="mt-8 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSaveChanges} 
            disabled={!hasChanges}
            data-testid="button-save-changes"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
