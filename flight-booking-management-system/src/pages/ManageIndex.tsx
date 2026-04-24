import { useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { mockBookings } from "@/lib/mockData";
import { BookingCard } from "@/components/BookingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plane } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ManageIndex() {
  const user = useAppStore((state) => state.user);
  const [_, setLocation] = useLocation();
  const [pnrInput, setPnrInput] = useState("");

  if (!user) return null;

  const userBookings = mockBookings.filter(b => b.ownerUsername === user.username);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.trim()) {
      setLocation(`/lookup`); // could pass state but simple enough
      // For this app, let's just navigate to lookup, or we can handle it directly
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">Select a trip below to choose meals and special services.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="Find by PNR..."
              className="pl-9 uppercase"
              maxLength={6}
            />
          </div>
          <Button type="button" variant="secondary" onClick={() => setLocation('/lookup')}>
            Find
          </Button>
        </form>
      </div>

      {userBookings.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {userBookings.map((booking) => (
            <BookingCard key={booking.pnr} booking={booking} />
          ))}
        </motion.div>
      ) : (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">No active bookings</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any upcoming trips associated with your account.
            </p>
            <Button onClick={() => setLocation('/lookup')}>Look up a booking</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
