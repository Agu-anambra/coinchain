import Image from "next/image";
import React from "react";

const Footer = () => {
  const phoneNumber = "2348012345678"; // Your number in international format
  const message = "Hello! I’m interested in your services."; // Optional
  const encodedMessage = encodeURIComponent(message);
  return (
    <footer
      data-section
      className=" text-[#b0b8d1] "
    >
      <div className="px-10 md:px-[100px] pt-5 md:pt-10 bg-black/90 grid md:grid-cols-3 lg:grid-cols-5 gap-10">
        <div>
          <a
            href="#"
            className="flex items-center gap-2 text-white text-xl md:text-3xl font-bold mb-4"
          >
            <Image
              src="/assets/images/COINCHAIN.png"
              alt="Coinchain logo"
              width={40}
              height={40}
            />
            Coinchain
          </a>
          <h2 className="text-white text-md md:text-xl font-semibold mb-3">
            Let's talk! 🤙
          </h2>
          <a
            href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
            className="block mb-1"
          >
            Chat on WhatsApp
          </a>
          <a href="mailto:coinchain01@gmail.com" className="block mb-1">
            coinchain01@gmail.com
          </a>
          <address className="not-italic">
            Cecilia Chapman 711-2880 Nulla St. Mankato Mississippi 96522
          </address>
        </div>
        {[
          [
            "Products",
            [
              "Spot",
              "Inverse Perpetual",
              "USDT Perpetual",
              "Exchange",
              "Launchpad",
              "Binance Pay",
            ],
          ],
          [
            "Services",
            [
              "Buy Crypto",
              "Markets",
              "Tranding Fee",
              "Affiliate Program",
              "Referral Program",
              "API",
            ],
          ],
          [
            "Support",
            [
              "Bybit Learn",
              "Help Center",
              "User Feedback",
              "Submit a request",
              "API Documentation",
              "Trading Rules",
            ],
          ],
          [
            "About Us",
            [
              "About Bybit",
              "Authenticity Check",
              "Careers",
              "Business Contacts",
              "Blog",
            ],
          ],
        ].map(([title, links], i) => (
          <ul key={i}>
            <li className="text-white text-sm font-bold uppercase tracking-wide mb-2 md:mb-4">
              {title}
            </li>
            {(links as string[]).map((link, idx) => (
              <li key={idx} className="md:mb-2">
                <a href="#" className="hover:text-blue-500 transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
