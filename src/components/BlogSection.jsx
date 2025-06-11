import React from "react";
import { useNavigate } from "react-router-dom";

const blogs = [
  {
    title: "Những điều cần biết về sức khỏe giới tính",
    img: "/src/assets/images/blog-gioitinh-1.jpg",
    desc: "Tìm hiểu các kiến thức cơ bản về sức khỏe giới tính, phòng tránh các bệnh lây truyền qua đường tình dục.",
  },
  {
    title: "Tầm quan trọng của xét nghiệm định kỳ",
    img: "/src/assets/images/blog-gioitinh-2.jpg",
    desc: "Xét nghiệm định kỳ giúp phát hiện sớm các bệnh lý, bảo vệ sức khỏe bản thân và cộng đồng.",
  },
  {
    title: "PrEP & PEP: Dự phòng HIV hiệu quả",
    img: "/src/assets/images/blog-gioitinh-3.jpg",
    desc: "Giải đáp về thuốc PrEP, PEP và cách sử dụng an toàn để phòng tránh lây nhiễm HIV.",
  },
];

const BlogSection = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-6xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Blog sức khỏe giới tính</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hình lớn bên trái */}
        <div className="md:col-span-2 flex flex-col">
          <img
            src={blogs[0].img}
            alt={blogs[0].title}
            className="w-full h-72 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{blogs[0].title}</h3>
          <p className="text-gray-600 mb-4">{blogs[0].desc}</p>
          <button
            className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/blog")}
          >
            Xem thêm
          </button>
        </div>
        {/* Hai hình nhỏ bên phải */}
        <div className="flex flex-col gap-6">
          {blogs.slice(1).map((blog, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <h4 className="font-semibold text-md mb-1">{blog.title}</h4>
              <p className="text-gray-500 text-sm mb-2">{blog.desc}</p>
              <button
                className="mt-auto text-blue-600 hover:underline text-sm font-medium"
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