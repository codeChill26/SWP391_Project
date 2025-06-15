import { Avatar, Card, Col, Rate, Row } from "antd";
import { UserLayout } from "../layout/userLayout";
import { VerifiedUserOutlined } from "@mui/icons-material";

const blogData = [
  {
    title: 'Các bệnh lây truyền qua đường tình dục',
    author: 'Hoàng Thị Lành',
    experience: 9,
    rating: 4.8,
    image: 'https://example.com/image1.jpg',
  },
  {
    title: 'Bệnh giang mai và những điều cần biết',
    author: 'Hoàng Thị Lành',
    experience: 9,
    rating: 4.8,
    image: 'https://example.com/image2.jpg',
  },
  {
    title: 'Tháng nhận thức HIV',
    author: 'Nguyễn Thanh Bình',
    experience: 10,
    rating: 4.9,
    image: 'https://example.com/image3.jpg',
  },
  {
    title: 'Chu trì kinh nguyệt và các thông tin quan trọng',
    author: 'Nguyễn Thanh Bình',
    experience: 10,
    rating: 4.9,
    image: 'https://example.com/image4.jpg',
  },
];
const Blog = () => {
   return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {blogData.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
            <Card
              hoverable
              cover={<img alt="example" src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
            >
              <h3>{item.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                <Avatar icon={<VerifiedUserOutlined />} size="small" />
                <div style={{ marginLeft: 8 }}>
                  <div>{item.author}</div>
                  <div style={{ fontSize: 12 }}>
                    {item.experience} năm kinh nghiệm&nbsp;&nbsp;
                   
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </UserLayout>
   )
}

export default Blog;