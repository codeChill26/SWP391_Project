import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const services = [
  {
    title: "Mua thuốc trực tuyến",
    desc: "Đặt thuốc theo toa, Nhận thuốc trong 2h.",
    img: "/src/assets/images/service-purchases.png",
    button: "Mua thuốc ngay",
    bg: "bg-[#6EC1E4]",
  },
  {
    title: "Phòng tư vấn trực tuyến",
    desc: "Nhận tư vấn sức khỏe mọi lúc mọi nơi từ Bác sĩ chuyên môn.",
    img: "/src/assets/images/service-doctor.png",
    button: "Đặt tư vấn",
    bg: "bg-[#8ED6FB]",
  },
  {
    title: "Xét nghiệm tại nhà",
    desc: "Không cần chờ đợi, điều dưỡng sẽ lấy mẫu tận nơi.",
    img: "/src/assets/images/service-lab.png",
    button: "Đăng ký",
    bg: "bg-[#5ED6C1]",
  },
  {
    title: "Bảo hiểm sức khỏe",
    desc: "Chăm sóc toàn diện cho bạn và người thân.",
    img: "/src/assets/images/service-insurance.png",
    button: "Đăng ký",
    bg: "bg-[#7ED957]",
  },
];

const CARD_WIDTH = 340; // px (bao gồm cả gap)
const GAP = 24; // px

const ServiceSection = () => {
  const [index, setIndex] = useState(0);
  const maxIndex = services.length - 1;
  const intervalRef = useRef();

  // Auto slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [maxIndex]);

  // Manual slide resets timer
  const handlePrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    resetInterval();
  };
  const handleNext = () => {
    setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    resetInterval();
  };
  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-[#3B9AB8] mb-6 text-center">Dịch vụ nổi bật</h2>
      <div className="relative max-w-5xl mx-auto px-2">
        {/* Arrow left */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
          onClick={handlePrev}
          aria-label="Trước"
        >
          <FaChevronLeft size={24} className="text-[#3B9AB8]" />
        </button>
        {/* Cards */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
              gap: `${GAP}px`,
              minWidth: `${CARD_WIDTH * services.length + GAP * (services.length - 1)}px`,
            }}
          >5
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`rounded-xl shadow-lg flex flex-col justify-between p-6 min-w-[320px] max-w-[320px] ${service.bg} text-white relative`}
                style={{ height: 200 }}
              >
                <div>
                  <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                  <p className="mb-4">{service.desc}</p>
                </div>
                <button className="bg-white text-[#3B9AB8] font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition">
                  {service.button}
                </button>
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute right-4 bottom-4 w-25 h-25 object-contain rounded-lg shadow"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Arrow right */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
          onClick={handleNext}
          aria-label="Sau"
        >
          <FaChevronRight size={24} className="text-[#3B9AB8]" />
        </button>
      </div>
    </section>
  );
};

export default ServiceSection;