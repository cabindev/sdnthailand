// components/Networks-SDN.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NetworkItem {
  id: string;
  image: string;
  url: string;
}

const networks: NetworkItem[] = [
  {
    id: '1',
    image: '/networks/healthy.webp',
    url: 'https://web.facebook.com/profile.php?id=100095177283316'
  },
  {
    id: '2',
    image: '/networks/lnomore.webp',
    url: 'https://web.facebook.com/lnomore.thailand'
  },
  {
    id: '3',
    image: '/networks/ysdn.webp',
    url: 'https://web.facebook.com/ysdnthailand'
  },
  {
    id: '4',
    image: '/networks/spiritual.webp',
    url: 'https://web.facebook.com/spiritualnetwork'
  },
  {
    id: '5',
    image: '/networks/sdnfutsal.webp',
    url: 'https://web.facebook.com/sdnfutsalNoL'
  },
  {
    id: '6',
    image: '/networks/sdn.webp',
    url: 'https://web.facebook.com/sdnthailand'
  },
  {
    id: '7',
    image: '/networks/chakkampaoson.webp',
    url: 'https://web.facebook.com/chakkampaoson'
  },
  {
    id: '8',
    image: '/networks/positive.webp',
    url: 'https://web.facebook.com/profile.php?id=100068312467386'
  },
  {
    id: '9',
    image: '/networks/social.webp',
    url: 'https://web.facebook.com/profile.php?id=100077226455080'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NetworksSDN() {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-[#1E293B]"
        >
          Our Networks
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {networks.map((network) => (
            <motion.div
              key={network.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <Link 
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4"
              >
                <div className="relative h-20">
                  <Image
                    src={network.image}
                    alt="Network logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}