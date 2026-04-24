import { useState } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { mockBookings } from "@/lib/mockData";
import { BookingCard } from "@/components/BookingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Utensils, Accessibility, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = useAppStore((state) => state.user);
  const selections = useAppStore((state) => state.selections);
  const [_, setLocation] = useLocation();

  if (!user) return null;

  const userBookings = mockBookings.filter(b => b.ownerUsername === user.username);
  
  // Calculate stats
  const activeBookingsCount = userBookings.length;
  
  let totalMeals = 0;
  let totalServices = 0;
  
  userBookings.forEach(booking => {
    const bSelections = selections[booking.pnr] || {};
    booking.passengers.forEach(p => {
      const pSel = bSelections[p.id];
      if (pSel?.meal) totalMeals++;
      if (pSel?.services?.length) totalServices += pSel.services.length;
    });
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2" data-testid="text-welcome">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground text-lg">Manage your upcoming journeys and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            <Ticket className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-bookings">{activeBookingsCount}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meals Selected</CardTitle>
            <Utensils className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-meals">{totalMeals}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Special Services</CardTitle>
            <Accessibility className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-services">{totalServices}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">Your Trips</h2>
            {userBookings.length > 0 && (
              <Button variant="outline" onClick={() => setLocation('/manage')} data-testid="button-view-all">
                View All
              </Button>
            )}
          </div>
          
          {userBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((booking) => (
                <BookingCard key={booking.pnr} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">No active bookings</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  You don't have any upcoming trips associated with this account.
                </p>
                <Button onClick={() => setLocation('/lookup')} data-testid="button-lookup-empty">
                  Look up a booking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="text-xl">Manage a booking</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Have a PNR from another booking?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-primary hover:bg-white/90" 
                onClick={() => setLocation('/lookup')}
                data-testid="button-lookup-card"
              >
                Look up PNR
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {user.role === "admin" && (
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  Admin Panel
                </CardTitle>
                <CardDescription>
                  Monitor all passenger selections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white" 
                  onClick={() => setLocation('/admin')}
                  data-testid="button-admin-card"
                >
                  View All Bookings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
