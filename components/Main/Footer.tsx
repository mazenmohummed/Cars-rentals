
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Car Rentals</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Rent a Car</Link></li>
            <li><Link href="#" className="hover:text-white">Long-term Rentals</Link></li>
            <li><Link href="#" className="hover:text-white">Luxury Cars</Link></li>
            <li><Link href="#" className="hover:text-white">SUV Rentals</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Help Center</Link></li>
            <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white">FAQs</Link></li>
            <li><Link href="#" className="hover:text-white">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">About Us</Link></li>
            <li><Link href="#" className="hover:text-white">Careers</Link></li>
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Facebook</Link></li>
            <li><Link href="#" className="hover:text-white">Instagram</Link></li>
            <li><Link href="#" className="hover:text-white">Twitter</Link></li>
            <li><Link href="#" className="hover:text-white">YouTube</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Ahmed Cars — All Rights Reserved.
      </div>
    </footer>
  );
}
