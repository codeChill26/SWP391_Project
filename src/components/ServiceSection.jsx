import { useRef, useState, useEffect } from "react";
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
  {
    title: "Trị liệu giọng nói",
    desc: "Tư vấn và hỗ trong điều trị giọng nói cho người chuyển giới.",
    img: "/src/assets/images/service-voice.png",
    button: "Tư vấn ngay",
    bg: "bg-[#3B9AB8]",
  },
  {
    title: "Hỗ trợ PrEP/PEP",
    desc: "Hỗ trợ sử dụng thuốc dự phòng trước và sau phơi nhiễm HIV.",
    img: "/src/assets/images/service-PEP.png",
    button: "Tìm hiểu",
    bg: "bg-[#3382a0]",
  },
  {
    title: "Xét nghiệm hormone",
    desc: "Xét nghiệm hormone định kỳ cho người chuyển giới.",
    img: "/src/assets/images/service-Test.png",
    button: "Đặt lịch",
    bg: "bg-[#B2E0F7]",
  },
  {
    title: "Tiêm chủng mở rộng",
    desc: "Đăng ký tiêm chủng cho trẻ em và người lớn.",
    img: "/src/assets/images/service-vaccination.png",
    button: "Đăng ký",
    bg: "bg-[#F7D774]",
  },
  {
    title: "Tư vấn tâm lý",
    desc: "Chuyên gia tâm lý hỗ trợ bạn vượt qua khó khăn.",
    img: "/src/assets/images/service-MentalHealth.png",
    button: "Đặt tư vấn",
    bg: "bg-[#F7B2B7]",
  },
  {
    title: "Theo dõi chu kỳ kinh nguyệt",
    desc: "Theo dõi và quản lý chu kỳ kinh nguyệt của bạn.",
    img: "/src/assets/images/service-menstrual.png",
    button: "Bắt đầu",
    bg: "bg-[#B2F7C1]",
  },
];

const CARD_WIDTH = 320;
const GAP = 24;

const ServiceSection = () => {
  // Responsive: 1 card on mobile, 2 on tablet, 3 on desktop
  const getVisibleCards = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());
  const [index, setIndex] = useState(0);
  const intervalRef = useRef();

  const maxIndex = services.length - visibleCards;

  // Responsive update
  useEffect(() => {
    const handleResize = () => {
      const newVisible = getVisibleCards();
      setVisibleCards(newVisible);
      if (index > services.length - newVisible) {
        setIndex(Math.max(0, services.length - newVisible));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [index]);

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
      <div className="relative max-w-6xl mx-auto flex items-center">
        {/* Arrow left */}
        <button
          className="hidden sm:flex absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
          onClick={handlePrev}
          aria-label="Trước"
        >
          <FaChevronLeft size={28} className="text-[#3B9AB8]" />
        </button>
        {/* Cards */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
              gap: `${GAP}px`,
              minWidth: `${CARD_WIDTH * services.length + GAP * (services.length - 1)}px`,
            }}
          >
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`rounded-xl shadow-lg flex flex-col justify-between p-6 min-w-[320px] max-w-[320px] ${service.bg} text-white relative`}
                style={{ height: 280 }}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                  <p className="mb-4">{service.desc}</p>
                </div>
                <div className="flex items-end justify-between">
                  <button className="bg-white text-[#3B9AB8] font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition">
                    {service.button}
                  </button>
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Arrow right */}
        <button
          className="hidden sm:flex absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
          onClick={handleNext}
          aria-label="Sau"
        >
          <FaChevronRight size={28} className="text-[#3B9AB8]" />
        </button>
      </div>
    </section>
  );
};

export default ServiceSection;