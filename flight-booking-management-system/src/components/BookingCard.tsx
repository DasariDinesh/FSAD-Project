import { Booking } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { format, isPast } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function BookingCard({ booking }: { booking: Booking }) {
  const isLocked = isPast(new Date(booking.editableUntil));
  
  return (
    <Card className="hover-elevate transition-all border-border h-full flex flex-col" data-testid={`card-booking-${booking.pnr}`}>
      <CardHeader className="pb-3 bg-muted/30 border-b">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-background">
              {booking.airline} {booking.flightNumber}
            </Badge>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <span data-testid={`text-origin-${booking.pnr}`}>{booking.origin.code}</span>
              <Plane className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-destination-${booking.pnr}`}>{booking.destination.code}</span>
            </CardTitle>
          </div>
          <Badge variant={isLocked ? "secondary" : "default"} data-testid={`badge-status-${booking.pnr}`}>
            {isLocked ? "Locked" : "Editable"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{format(new Date(booking.departure), "MMM d, yyyy")}</p>
              <p className="text-muted-foreground">
                {format(new Date(booking.departure), "h:mm a")} - {format(new Date(booking.arrival), "h:mm a")}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">
                {booking.origin.city} to {booking.destination.city}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p>{booking.passengers.length} Passenger{booking.passengers.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 px-4 border-t mt-auto flex flex-col gap-3">
         <div className="w-full flex items-center justify-between text-xs text-muted-foreground mt-3">
            <span>PNR: <strong className="text-foreground tracking-wider">{booking.pnr}</strong></span>
            {!isLocked && <span>Edit until {format(new Date(booking.editableUntil), "MMM d")}</span>}
         </div>
         <Link href={`/manage/${booking.pnr}`} className="w-full">
           <Button variant="secondary" className="w-full group" data-testid={`button-manage-${booking.pnr}`}>
             Manage Booking
             <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
         </Link>
      </CardFooter>
    </Card>
  );
}
