"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "./BookFlip.css";

type BookFlipProps = {
  children: React.ReactElement;
};

export default function BookFlip({ children }: BookFlipProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500); // delay optional
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container max-w-2xl">
      <div className={`book ${isOpen ? "open" : ""}`}>
        <span className="shadow"></span>
        <div className="back"></div>
        <div className="cover-end"></div>
        <div className="page last">
          <div className="page-content">{children}</div>
        </div>
        <div className="page first"></div>
        <div className="page second"></div>
        <div className="page third"></div>
        <div className="cover bg-white">
          <Image
            src="/guestbook.png"
            alt="Book Cover"
            width={700}
            height={500}
            className="cover-img object-center object-contain"
          />
        </div>
      </div>
    </div>
  );
}
