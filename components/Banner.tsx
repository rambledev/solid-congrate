"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full">
      <Image
        src="/banner.webp"
        alt="Graduation Banner"
        width={1920}
        height={500}
        className="w-full h-auto object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        {/* <h1 className="text-3xl md:text-4xl font-bold">ระบบรับปริญญา 2568</h1>
        <p className="text-lg md:text-xl mt-2">มหาวิทยาลัยราชภัฏมหาสารคาม</p> */}
      </div>
    </div>
  );
}
