import React from "react";
import { useNavigate } from "react-router-dom";

const blogs = [
  {
    title: "Những điều cần biết về sức khỏe giới tính",
    img: "/src/assets/images/blog_genderhealth.png",
    desc: "Tìm hiểu các kiến thức cơ bản về sức khỏe giới tính, phòng tránh các bệnh lây truyền qua đường tình dục.",
  },
  {
    title: "Tầm quan trọng của xét nghiệm định kỳ",
    img: "/src/assets/images/blog_checkup.png",
    desc: "Xét nghiệm định kỳ giúp phát hiện sớm các bệnh lý, bảo vệ sức khỏe bản thân và cộng đồng.",
  },
  {
    title: "PrEP & PEP: Dự phòng HIV hiệu quả",
    img: "/src/assets/images/blog_PrEp.png",
    desc: "Giải đáp về thuốc PrEP, PEP và cách sử dụng an toàn để phòng tránh lây nhiễm HIV.",
  },
];

const BlogSection = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-6xl mx-auto mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#3B9AB8' }}>Blog sức khỏe giới tính</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hình lớn bên trái, đóng khung */}
        <div className="md:col-span-2 flex flex-col bg-white rounded-xl shadow-lg border border-[#3B9AB8]/30 p-6">
          <img
            src={blogs[0].img}
            alt={blogs[0].title}
            className="w-full h-72 object-cover rounded-xl mb-4 border border-[#3B9AB8]/20"
          />
          <h3 className="text-xl font-bold mb-2 text-[#3B9AB8]">{blogs[0].title}</h3>
          <p className="text-gray-700 mb-4">{blogs[0].desc}</p>
          <button
            className="self-start px-5 py-2 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#3382a0] transition"
            onClick={() => navigate("/blog")}
          >
            Xem thêm
          </button>
        </div>
        {/* Hai hình nhỏ bên phải */}
        <div className="flex flex-col gap-6">
          {blogs.slice(1).map((blog, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full border border-[#3B9AB8]/10">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-28 object-cover rounded-lg mb-2 border border-[#3B9AB8]/20"
              />
              <h4 className="font-semibold text-md mb-1 text-[#3B9AB8]">{blog.title}</h4>
              <p className="text-gray-700 text-sm mb-2">{blog.desc}</p>
              <button
                className="mt-auto text-[#3B9AB8] hover:underline text-sm font-medium"
                onClick={() => navigate("/blog")}
              >
                Xem thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;