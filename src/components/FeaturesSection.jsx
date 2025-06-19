import React from "react";
import { FaShieldAlt, FaFileAlt, FaUserMd, FaHeadset, FaAward } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-[#3B9AB8]" />,
      title: "Thủ tục đơn giản",
      desc: "Chỉ cần thẻ BHYT và đơn thuốc, nhận thuốc ngay"
    },
    {
      icon: <FaFileAlt className="text-4xl text-[#3B9AB8]" />,
      title: "Miễn phí xét nghiệm",
      desc: "12 chỉ số quan trọng hoàn toàn miễn phí"
    },
    {
      icon: <FaUserMd className="text-4xl text-[#3B9AB8]" />,
      title: "Bác sĩ chuyên khoa",
      desc: "Tư vấn và theo dõi điều trị tận tình"
    },
    {
      icon: <GiMedicinePills className="text-4xl text-[#3B9AB8]" />,
      title: "Thuốc chất lượng",
      desc: "Đảm bảo nguồn gốc và chất lượng thuốc ARV"
    },
    {
      icon: <FaHeadset className="text-4xl text-[#3B9AB8]" />,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ tư vấn luôn sẵn sàng giúp đỡ"
    },
    {
      icon: <FaAward className="text-4xl text-[#3B9AB8]" />,
      title: "Uy tín hàng đầu",
      desc: "Được Bộ Y tế công nhận chất lượng"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-[#3B9AB8] mb-6 text-center">Tại sao chọn chúng tôi?</h2>
      <p className="text-gray-600 text-center mb-12">Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu</p>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3B9AB8]/20 transform hover:-translate-y-2"
            >
              <div className="mb-4 p-3 bg-[#d1e9f3] rounded-full w-max mx-auto">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#3B9AB8] mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 