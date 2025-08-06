import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Button,
  Modal,
  DatePicker,
  TimePicker,
  Radio,
  Input,
  message,
  Divider,
  Typography,
} from "antd";
import axios from "axios";
import { appointmentApi } from "../../api/appointment-api";
import { vnpayApi } from "../../api/vnpay-api";
import { saveAppointmentData } from "../../utils/paymentUtils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DollarOutlined, CreditCardOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
dayjs.extend(utc);

const Service = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [notes, setNotes] = useState("");

  const serviceImages = {
    "Xét nghiệm Testosterone": "https://medlatec.vn/media/15821/content/20200402_xet-nghiem-testosteron-1.png",
    "Kiểm tra tinh dịch đồ": "https://login.medlatec.vn//ImagePath/images/20221012/20221012_xet-nghiem-tinh-dich-do-bao-nhieu-tien-2.jpg",
    "Siêu âm tuyển tiền liệt": "https://login.medlatec.vn//ImagePath/images/20210701/20210701_Sieu-am-la-gi--.jpg",
    "Tầm soát ung thư tuyến tiền liệt": "https://tulsaprocedure.com/wp-content/uploads/2022/03/psa-testing-and-psa-levels.png",
    "Xét nghiệm nội tiết tố nam": "https://ecopharma.com.vn/wp-content/uploads/2025/05/xet-nghiem-noi-tiet-to-nam-fsh.jpg",
    "Kiểm tra rối loạn cương dương": "https://benhviendakhoatinhphutho.vn/wp-content/uploads/2023/02/roi-loan-cuong-duong-3.jpg",
    "Do loãng xương nam giới": "https://bernard.vn/static/1348/2022/12/13/mceu_11841808721670913352899.webp",
    "Khám nam khoa tổng quát": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/chi_phi_kham_nam_khoa_la_bao_nhieu_e9237516ff.jpg",
    "Xét nghiệm HIV cho nam": "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/hieu_ro_cac_phuong_phap_xet_nghiem_hiv_kien_thuc_quan_trong_ve_suc_khoe_can_nam_1_6d16258a81.jpg",
    "Tầm soát bệnh lây qua đường tình dục nam giới": "https://online.benhvienphuongdong.vn/wp-content/uploads/2025/02/benh-tinh-duc-4.png",
    "Xét nghiệm estrogen": "https://tamanhhospital.vn/wp-content/uploads/2024/10/xet-nghiem-nong-do-estrogen-trong-co-the.jpg",
    "Siêu âm tử cung buồng trứng": "https://isofhcare-backup.s3-ap-southeast-1.amazonaws.com/images/sieu-am-o-bung-giup-phat-hien-cac-bat-thuong-ve-kich-thuoc-vi-tri-cac-tang-o-bung_2a4572bb_3092_48ce_bef3_d9181acee3bc.png",
    "Tầm soát ung thư cổ tử cung": "https://sadec.phuongchau.com/wp-content/uploads/2021/05/hieu-biet-ve-ung-thu-co-tu-cung-e1582108929410.jpg",
    "Siêu âm tuyến vú": "https://benhvienbacha.vn/wp-content/uploads/2023/02/tam-soat-ung-thu-vu.jpg",
    "Xét nghiệm HPV": "https://clpmag.com/wp-content/uploads/2021/07/HPV-Test-1280x640.jpg",
    "Do loãng xương nữ giới": "https://bernard.vn/static/1348/2022/12/13/mceu_11841808721670913352899.webp",
    "Xét nghiệm HIV cho nữ": "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/hieu_ro_cac_phuong_phap_xet_nghiem_hiv_kien_thuc_quan_trong_ve_suc_khoe_can_nam_1_6d16258a81.jpg",
    "Tầm soát bệnh lây qua đường tình dục nữ": "https://careplusvn.com/Uploads/t/lt/ltqdtd-nu_0007590_730.jpeg",
    "Combo chăm sóc sức khỏe nữ nhân nhân": "https://cdn.phongkhamhoangtuan.vn/media/cham-soc-suc-khoe-chu-dong-toan-dien-cao-cap-cho-nu-duoi-40-tuoi.jpg",
    "Combo chăm sóc tình dục": "https://www.phongkhamsaigonmekong.com/wp-content/uploads/2021/02/gt.jpg",
    "Combo chăm sóc toàn diện": "https://benhvienbacha.vn/wp-content/uploads/2023/01/chuyen-gia-giai-dap-kham-suc-khoe-tong-quat-gom-nhung-gi.jpg"
  };

  useEffect(() => {
    axios
      .get("https://api-genderhealthcare.purintech.id.vn/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const showBookingModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedService(null);
    setDate(null);
    setNotes("");
  };

  const handlePayment = async () => {
    if (!date || !selectedService) {
      message.error("Vui lòng chọn ngày và thời gian!");
      return;
    }
    try {
      const userId = Number(localStorage.getItem("id"));
      const appointmentTime = dayjs(date).utc().add(7, 'hours').toISOString();

      console.log(typeof date);
      console.log("dateTime", date);
      console.log("appointmentTime", appointmentTime);

      const data = {
        service_id: selectedService.id,
        userId: userId,
        specialization: "ANDROLOGY", // TODO: Chuyên khoa nam khoa (ANDROLOGY), nữ khoa GYNECOLOGY
        patientNotes: notes || "",
        appointmentTime: appointmentTime,
        paymentMethod: "pending",
      };

      // Save appointment data to localStorage
      const transactionId = saveAppointmentData(data);
      
      // Gọi API để tạo URL thanh toán VNPay
      const amount = selectedService.price; // Số tiền gốc (không nhân 100)
      const orderInfo = `Thanh toan dich vu: ${selectedService.id}`;
      const callbackUrl = `${window.location.origin}/payment/callback`;
      
      console.log('Calling VNPay API with:', {
        vnpayId: transactionId,
        amount: amount,
        orderInfo: orderInfo,
        callbackUrl: callbackUrl
      });

      const response = await vnpayApi.createPayment(
        transactionId,
        amount,
        orderInfo,
        callbackUrl
      );

      if (response.success && response.paymentUrl) {
        message.success(
          "Đang chuyển đến trang thanh toán VNPay..."
          ,10
        );
        
        // Redirect to VNPay payment URL
        window.location.href = response.paymentUrl;
      } else {
        message.error("Có lỗi xảy ra khi tạo URL thanh toán!");
      }
      
      setModalOpen(false);
      setSelectedService(null);
      setDate(null);
      setNotes("");
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo thanh toán!");
      console.log("error", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="bg-[#3B9AB8] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Our Services</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Comprehensive gender healthcare services designed to support
                your journey with expert care and understanding.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-stretch justify-between aspect-square min-h-[300px]"
            >
              <img
                src={service.imageUrl || serviceImages[service.name] || "https://via.placeholder.com/300x160?text=No+Image"}
                alt={service.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{service.name}</h2>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-blue-600 font-semibold mb-2">
                Giá: {service.price.toLocaleString()} VNĐ
              </p>
              <div className="flex-1"></div>
              <Button
                type="primary"
                style={{ background: "#3B9AB8", borderColor: "#3B9AB8" }}
                onClick={() => showBookingModal(service)}
              >
                Book Now
              </Button>
            </div>
          ))}

        </div>
      </div>
      <Footer />
      <Modal
        title={
          <div className="flex items-center">
            <CreditCardOutlined className="mr-2 text-blue-600" />
            <span>Đặt lịch dịch vụ</span>
          </div>
        }
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        {/* Thông tin dịch vụ */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <Text strong className="text-lg">{selectedService?.name}</Text>
            <div className="text-right">
              <Text className="text-gray-600 text-sm">Giá dịch vụ</Text>
              <div className="text-2xl font-bold text-blue-600">
                {selectedService?.price?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
          <Text className="text-gray-600">{selectedService?.description}</Text>
        </div>

        {/* Thông tin đặt lịch */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ngày và thời gian:
            </label>
            <DatePicker
              className="w-full"
              showTime={{
                format: 'HH:mm',
                minuteStep: 30,
                showNow: false,
                hideDisabledOptions: true,
                disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23],
                disabledMinutes: () => {
                  // Chỉ cho phép các phút 0 và 30
                  return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute % 30 !== 0);
                }
              }}
              value={date}
              onChange={setDate}
              disabledDate={(d) => d && d < new Date()}
              format="YYYY-MM-DD HH:mm"
              placeholder="Chọn ngày và thời gian"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (nếu có):
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập tình trạng hoặc yêu cầu đặc biệt..."
              rows={3}
            />
          </div>
        </div>

        {/* Tổng kết thanh toán */}
        <Divider />
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          {/* <div className="flex justify-between items-center mb-2">
            <Text>Phí dịch vụ:</Text>
            <Text>{selectedService?.price?.toLocaleString()} VNĐ</Text>
          </div> */}
          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <Text strong className="text-lg">Tổng cộng:</Text>
            <Text strong className="text-lg text-blue-600">
              {selectedService?.price?.toLocaleString()} VNĐ
            </Text>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <DollarOutlined className="text-yellow-600 mr-2" />
            <Text strong className="text-yellow-800">Thông tin thanh toán</Text>
          </div>
          <Text className="text-sm text-yellow-700">
            • Thanh toán trước khi khám để đảm bảo lịch hẹn<br/>
            • Hỗ trợ thanh toán qua VNPay, chuyển khoản ngân hàng<br/>
            • Có thể phát sinh thêm chi phí xét nghiệm trong quá trình khám
          </Text>
        </div>

        {/* Nút thanh toán */}
        <div className="flex justify-end space-x-3">
          <Button onClick={handleModalClose} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<CreditCardOutlined />}
            style={{ 
              background: "#3B9AB8", 
              borderColor: "#3B9AB8",
              height: "48px",
              padding: "0 24px"
            }}
            onClick={handlePayment}
            disabled={!date}
          >
            Thanh toán ngay
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Service;
