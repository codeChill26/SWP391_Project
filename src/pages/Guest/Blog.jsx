import { Avatar, Card, Col, Rate, Row } from "antd";
import { UserLayout } from "../../layout/userLayout";
import { VerifiedUserOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import blogData from "../components/BlogData";

const Blog = () => {
   return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {blogData.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
            <Card
              hoverable
              cover={<img alt="example" src={item.image} style={{ height: 400, objectFit: 'cover' }} />}
            >
              <Link to={`/blogs/${item.id}`}>
              <h3>{item.title}</h3>
              </Link>
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