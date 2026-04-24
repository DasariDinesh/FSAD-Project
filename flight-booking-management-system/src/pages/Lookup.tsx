import { useState } from "react";
import { useLocation } from "wouter";
import { mockBookings } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plane } from "lucide-react";
import { BookingCard } from "@/components/BookingCard";
import { motion } from "framer-motion";

export default function Lookup() {
  const [pnrInput, setPnrInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    
    const uppercasePnr = pnrInput.trim().toUpperCase();
    const booking = mockBookings.find(b => b.pnr === uppercasePnr);
    
    setFoundBooking(booking || null);
    setSearched(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-serif font-bold text-foreground mb-3">Find Your Journey</h1>
        <p className="text-muted-foreground">Enter your Passenger Name Record (PNR) to view and manage your flight.</p>
      </motion.div>

      <Card className="border-border shadow-md mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                placeholder="Enter 6-character PNR (e.g. XYZ123)"
                className="pl-10 uppercase h-12 text-lg"
                maxLength={6}
                data-testid="input-pnr"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" data-testid="button-search">
              Lookup
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {foundBooking ? (
            <div>
              <h2 className="text-xl font-bold mb-4 px-1">Booking Found</h2>
              <BookingCard booking={foundBooking} />
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-bold mb-2">Booking not found</h3>
                <p className="text-muted-foreground">
                  We couldn't find a booking matching "{pnrInput.toUpperCase()}". Please check your PNR and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
