
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white  mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Long & short-term Rentals</Link></li>
            <li><Link href="#" className="hover:text-white">Premium Cars</Link></li>
            <li><Link href="#" className="hover:text-white">Limousine Services</Link></li>
            <li><Link href="#" className="hover:text-white">Trips </Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white  mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Help Center</Link></li>
            <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white">FAQs</Link></li>
            <li><Link href="#" className="hover:text-white">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white  mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">About Us</Link></li>
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold text-white  mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Facebook</Link></li>
            <li><Link href="#" className="hover:text-white">Instagram</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Hurghadians — All Rights Reserved.
      </div>
    </footer>
  );
}
