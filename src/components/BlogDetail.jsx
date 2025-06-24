import { useParams } from "react-router-dom";
import { Card } from "antd";
import blogData from "./BlogData"; // Move blogData to a separate file for reuse
import { UserLayout } from '../layout/userLayout'

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogData.find((item) => item.id === id);

  if (!blog) return <div>Blog not found</div>;

  return (
    <UserLayout>
    <Card title={blog.title} style={{ margin: 24 }}>
      <img src={`/${blog.image}`} alt={blog.title} style={{ width: "100%", maxHeight: 600, objectFit: "cover" }} />
      <p>Tác giả: {blog.author}</p>
      <p>Kinh nghiệm: {blog.experience} năm</p>
      <p>Đánh giá: {blog.rating}</p>
      {/* Add more details here */}
    </Card>
    </UserLayout>
  );
};

export default BlogDetail;