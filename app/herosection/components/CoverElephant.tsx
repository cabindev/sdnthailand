'use client';

import Image from 'next/image';

export default function CoverElephant() {
  return (
    <section className="relative w-full">
      {/* Desktop Image - 1920x630px */}
      <div className="hidden md:block relative w-full h-[630px]">
        <a
          href="https://civicspace.sdnthailand.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <Image
            src="/campaign/CoverElephant.jpg"
            alt="Civic Space - พื้นที่พลเมือง"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </a>
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden relative w-full h-[400px]">
        <a
          href="https://civicspace.sdnthailand.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <Image
            src="/campaign/CoverElephant.jpg"
            alt="Civic Space - พื้นที่พลเมือง"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </a>
      </div>
    </section>
  );
}
