import React, { useState } from "react";

const Partners = () => {
  const [isPartnersPaused, setIsPartnersPaused] = useState(false);

  // Partner logos array for easy management
  const partnerLogos = [
    "https://logos-world.net/wp-content/uploads/2020/03/Coca-Cola-Logo.png",
    "https://th.bing.com/th/id/R.1e90245986039b84305aa20206dea2ad?rik=O%2b7qNV%2fEb8xw2g&pid=ImgRaw&r=0",
    "https://static.wixstatic.com/media/9d8ed5_651b6cb038ff4917bcdbe0c58ca2c241~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/9d8ed5_651b6cb038ff4917bcdbe0c58ca2c241~mv2.png",
    "https://ebaohiem.com/images/source/tin_tuc/2019/logo-bao-hiem-xa-hoi-viet-nam.jpg",
    "https://th.bing.com/th/id/OIP.MejFHh0UQHtNM6U75aOoxgHaHa?w=512&h=512&rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://th.bing.com/th/id/OIP.Du9qNNvEVHtVaV8TrSHqWwAAAA?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://songbangplastic.com/wp-content/uploads/2022/01/bvdhyd.jpeg",
    "https://th.bing.com/th/id/OIP.NGY9uCBfSFTUKKW9JBKqeQAAAA?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://th.bing.com/th/id/R.94bd23045324c6857df1c8149af50cb3?rik=Nrv1%2bhhaJpZNQg&riu=http%3a%2f%2fconsosukien.vn%2fpic%2fNews%2fbo-giao-duc-va-dao-tao-tiep-tuc-xay-dung-va-hoan-thien-co-so-du-lieu-nganh-giao-duc.jpg&ehk=aZt4I0LoztCD%2bnKIP%2bb8fk1OCoU83e4FvHme5JD1VHY%3d&risl=&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/OIP.r8LYj7EID5rcC2m42w2zMwHaHa?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
  ];

  return (
    <section className="w-full py-12 bg-white border-t border-[#E63946]/20">
      <h2 className="text-2xl font-bold text-center text-[#3B9AB8] mb-8">Đối tác của GenHealth</h2>
      <div className="overflow-hidden relative">
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            width: 'max-content',
            animation: 'scrollX 30s linear infinite',
            animationPlayState: isPartnersPaused ? 'paused' : 'running',
          }}
          onMouseDown={() => setIsPartnersPaused(true)}
          onMouseUp={() => setIsPartnersPaused(false)}
          onMouseLeave={() => setIsPartnersPaused(false)}
          onTouchStart={() => setIsPartnersPaused(true)}
          onTouchEnd={() => setIsPartnersPaused(false)}
        >
          {/* Render two sets of logos for seamless looping */}
          {[...partnerLogos, ...partnerLogos].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Partner ${idx % partnerLogos.length + 1}`}
              className="h-20 w-auto object-contain inline-block mx-6"
              draggable="true"
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Partners; 