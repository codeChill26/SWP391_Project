import { Avatar, Card, Col, Rate, Row } from "antd";
import { UserLayout } from "../../layout/userLayout";
import { VerifiedUserOutlined } from "@mui/icons-material";

const blogData = [
  {
    title: 'Những điều cần biết về sức khỏe giới tính',
    author: 'Báo thanh niên',
    image: 'https://static.benhvienphusanhanoi.vn/660x400/images/upload/02122025/khiconlechlacchuyengioitinh.jpeg', // Chèn ảnh phù hợp từ Imgur
    link: 'https://thanhnien.vn/suc-khoe/gioi-tinh.htm',
  },
  {
    title: 'Tầm quan trọng của xét nghiệm định kì',
    author: 'Phu Uyne',
    image: 'https://login.medlatec.vn//ImagePath/images/20200512/20200512_kham-suc-khoe-dinh-ki-05.jpg', // Chèn ảnh phù hợp từ Imgur
    link: 'http://phuyencdc.vn/dich-vu-bang-gia/kham-phat-hien-benh-nghe-nghiep-quan-trac-moi-truong-lao-don/tam-quan-trong-cua-kham-suc-khoe-dinh',
  },
  {
    title: 'Điều trị PrEP hiệu quả cao trong dự phòng lây nhiễm HIV',
    author: 'Trung tầm tầm soát HIV',
    image: 'https://vaac.gov.vn/upload/t7-2021/prep-2.jpg?v=1.0.0',
    link: 'https://vnexpress.net/cu-soc-tam-ly-khi-phat-hien-chung-mo-ho-gioi-tinh-4792118.html',
  },
  {
    title: 'Các bệnh lây truyền qua đường tình dục',
    author: 'GenHealth',
    image: 'https://tamanhhospital.vn/wp-content/uploads/2022/03/benh-lay-qua-duong-tinh-duc.jpg',
    link: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftamanhhospital.vn%2Fbenh-lay-qua-duong-tinh-duc%2F&psig=AOvVaw1r8QkCcY9X1dZgaVWlfRkn&ust=1752772138686000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMiknZzvwY4DFQAAAAAdAAAAABAE',
  },
  {
    title: 'Bệnh giang mai và những điều cần biết',
    author: 'UMC',
    image: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/giang_mai_giai_doan_1_bieu_hien_nhu_the_nao_1_9ecc24c05e.jpg',
    link: 'https://www.vinmec.com/vie/bai-viet/benh-giang-mai-nguyen-nhan-duong-lay-dau-hieu-nhan-biet-vi',
  },
  {
    title: 'Tháng nhận thức HIV',
    author: 'Trung tâm kiểm soát HIV',
    image: 'https://www.nfid.org/wp-content/uploads/bb-plugin/cache/HIV-virus-panorama-c90632db797561baea98c48b2777d9f6-ifmulep01ros.jpeg',
    link: 'https://vaac.gov.vn/hiv-aids-nhung-dieu-can-biet.htmlhttps://vncdc.gov.vn/thang-hanh-dong-quoc-gia-ve-phong-chong-hiv-aids-2023-diem-moi-la-gi-nd17212.html',
  },
  {
    title: 'Chu trì kinh nguyệt và các thông tin quan trọng',
    author: 'NewsCare',
    image: 'https://benhvienphuongdong.vn/public/uploads/2022/thang-12/chu-ky-kinh-nguyet/cach-tinh-chu-ky-kinh-nguyet.png',
    link: 'https://youmed.vn/tin-tuc/chu-ky-kinh-nguyet-cua-ban-dien-ra-nhu-the-nao/',
  },
  {
    title: 'Mang giới tính nam trong hình hài phụ nữ',
    author: 'VnExpress',
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/JRGSJiLd3e5GsxdM0P2pqg65KoKccc/Image/2013/01/so1/gioi-tinh-3-bf497.jpg', // Chèn ảnh phù hợp từ Imgur
    link: 'https://vnexpress.net/mang-gioi-tinh-nam-trong-hinh-hai-phu-nu-4795335.html',
  },
  {
    title: 'Giáo dục giới tính sớm để ngăn "trẻ em sinh ra trẻ em"',
    author: 'VnExpress',
    image: 'https://cdn2.tuoitre.vn/zoom/480_300/471584752817336320/2025/7/2/xam-hai-tinh-duc-1751428700389624715038-24-0-824-1280-crop-1751428782019277229941.jpg', // Chèn ảnh phù hợp từ Imgur
    link: 'https://vnexpress.net/giao-duc-gioi-tinh-som-de-ngan-tre-em-sinh-ra-tre-em-4860533.html',
  },
  {
    title: 'Tình hình nhiễm trùng lây qua đường tình dục ở Việt Nam, thói quen và định kiến trong xã hội."',
    author: 'VnExpress',
    image: 'https://nld.mediacdn.vn/thumb_w/698/291774122806476800/2021/12/25/z3053456608790962b67c15c13df3630c0b4388a2d88ad-16404284259162521735.jpg', // Chèn ảnh phù hợp từ Imgur
    link: 'https://www.researchgate.net/publication/44669722_Sexuality_and_health_in_Vietnam--new_directions_Introduction',
  },
  {
    title: 'Cú sốc tâm lý khi phát hiện chứng mơ hồ giới tính',
    author: 'VnExpress',
    image: 'https://cdn.bcare.vn/resize_773x515/2019/04/19/Gi%E1%BB%9Bi%20t%C3%ADnh%20m%C6%A1%20h%E1%BB%931.jpg', // Chèn ảnh phù hợp từ Imgur
    link: 'https://vnexpress.net/cu-soc-tam-ly-khi-phat-hien-chung-mo-ho-gioi-tinh-4792118.html',
  }
  
];
const Blog = () => {
  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          {blogData.map((item, index) => (
            <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Card
                  hoverable
                  cover={<img alt={item.title} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <h3>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                    <Avatar icon={<VerifiedUserOutlined />} size="small" />
                    <div style={{ marginLeft: 8 }}>
                      <div>{item.author}</div>
                      
                    </div>
                  </div>
                </Card>
              </a>

            </Col>
          ))}
        </Row>
      </div>
    </UserLayout>
  )
}

export default Blog;