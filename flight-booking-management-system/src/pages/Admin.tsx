import { useLocation } from "wouter";
import { mockBookings } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Admin() {
  const user = useAppStore(state => state.user);
  const selections = useAppStore(state => state.selections);
  const [searchTerm, setSearchTerm] = useState("");
  const [_, setLocation] = useLocation();

  if (user?.role !== "admin") return null; // ProtectedRoute handles redirect

  const filteredBookings = mockBookings.filter(b => 
    b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.passengers.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground">Monitor all bookings and passenger selections.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl">All Bookings</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search PNR or passenger name..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px]">PNR</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Selections</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map(booking => {
                const isLocked = isPast(new Date(booking.editableUntil));
                
                let mealCount = 0;
                let serviceCount = 0;
                const bSelections = selections[booking.pnr] || {};
                
                booking.passengers.forEach(p => {
                  const pSel = bSelections[p.id];
                  if (pSel?.meal) mealCount++;
                  if (pSel?.services?.length) serviceCount += pSel.services.length;
                });

                return (
                  <TableRow key={booking.pnr} className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/manage/${booking.pnr}`)}>
                    <TableCell className="font-medium tracking-wide">{booking.pnr}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{booking.airline}</div>
                      <div className="text-xs text-muted-foreground">{booking.flightNumber}</div>
                    </TableCell>
                    <TableCell>
                      {booking.origin.code} → {booking.destination.code}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.departure), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.passengers[0].name}</div>
                      {booking.passengers.length > 1 && (
                        <div className="text-xs text-muted-foreground">+{booking.passengers.length - 1} more</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {mealCount > 0 && <Badge variant="outline" className="bg-primary/5">{mealCount} Meals</Badge>}
                        {serviceCount > 0 && <Badge variant="outline" className="bg-secondary/5 text-secondary">{serviceCount} Services</Badge>}
                        {mealCount === 0 && serviceCount === 0 && <span className="text-xs text-muted-foreground">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isLocked ? "secondary" : "default"} className={isLocked ? "opacity-70" : ""}>
                        {isLocked ? "Locked" : "Editable"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
