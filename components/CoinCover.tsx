import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";
const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};
interface props {
  variant?: BookCoverVariant;
  className: string;
  coverImage: string;
}
const CoinCover = ({
  className,
  variant = "regular",
  // coverColor = "#012B48",
  coverImage,
}: props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={coverImage}
          alt="coin cover"
          fill
          className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};

export default CoinCover;
