// "use client";

// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Calendar22 } from "../HeadBar/Calendar22";
// import * as React from "react"
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";

// type Props = {
//   carId: string;
// };

// export default function CarAvailabilityForm({ carId }: Props) {

//   const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
//   const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
//   const [reason, setReason] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!startDate || !endDate) {
//       alert("Please select start and end dates");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/admin/car-availability", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           carId,
//           startDate,
//           endDate,
//           reason,
//           isActive,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to create availability");
//       }

//       alert("Availability added successfully");
//       setStartDate(undefined);
//       setEndDate(undefined);
//       setReason("");
//       setIsActive(true);
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 rounded-md border p-4"
//     >
//       <h2 className="text-lg font-semibold">Block Car Availability</h2>



//       {/* Start Date */}
//       <Calendar22
//          Title="Start Date"
//          value={startDate}
//          onChange={(date) => setStartDate(date)}
//        />

//       {/* End Date */}
//         <Calendar22
//          Title="End Date"
//          value={endDate}
//          onChange={(date) => setEndDate(date)}
//        />

//       {/* Reason */}
//       <div className="grid gap-3">
//             <Label htmlFor="sheet-demo-name">Reason</Label>
//             <Input id="sheet-demo-name" placeholder="Maintenance, booked, cleaning..."
//             value={reason}
//             onChange={(e) => setReason(e.target.value)} />
//           </div>

//       {/* Active Toggle */}
//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={isActive}
//           onChange={(e) => setIsActive(e.target.checked)}
//         />
//         <span className="text-sm">Active</span>
//       </div>

//       {/* Submit */}
//       <Button
//         disabled={loading}
        
//       >
//         {loading ? "Saving..." : "Add Availability"}
//       </Button>
//     </form>
//   );
// }
