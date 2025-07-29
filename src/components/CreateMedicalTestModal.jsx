import { Modal, Form, Input, InputNumber, DatePicker, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { provideMedicalTestApi } from "../api/provideMedicalTest-api";

const { Option } = Select;

// Gợi ý placeholder theo loại xét nghiệm
const getResultPlaceholder = (testName) => {
  const placeholders = {
    // STD Tests
    "HIV Combo (Kháng nguyên + Kháng thể)": "Dương tính / Âm tính",
    "HIV Kháng thể": "Dương tính / Âm tính",
    "Giang mai - VDRL": "Dương tính / Âm tính (hoặc titer: 1:2, 1:4, 1:8...)",
    "Giang mai - TPHA": "Dương tính / Âm tính",
    "Lậu - PCR": "Dương tính / Âm tính",
    "Chlamydia - PCR": "Dương tính / Âm tính",
    "Herpes HSV-1": "Dương tính / Âm tính",
    "Herpes HSV-2": "Dương tính / Âm tính",
    "HPV (Papillomavirus)": "Dương tính / Âm tính (hoặc genotyping: 16, 18, 31, 33...)",
    
    // HIV Monitoring
    "CD4 Count": "Số lượng tế bào/μL (ví dụ: 450 cells/μL)",
    "Tải lượng virus HIV": "Copies/mL (ví dụ: <50 copies/mL = Undetectable)",
    "Tỷ lệ CD4": "Phần trăm (ví dụ: 25%)",
    "Tỷ lệ CD4/CD8": "Tỷ lệ (ví dụ: 1.2)",
    
    // Male Health
    "PSA Tổng": "ng/mL (ví dụ: 2.5 ng/mL)",
    "PSA Tự do": "ng/mL (ví dụ: 0.8 ng/mL)",
    "Tinh dịch đồ": "Số lượng: X triệu/ml, Độ di động: X%, Hình dạng bình thường: X%",
    "Testosterone": "ng/dL (ví dụ: 450 ng/dL)",
    "Prolactin": "ng/mL (ví dụ: 15 ng/mL)",
    "FSH (Nam)": "mIU/mL (ví dụ: 5.2 mIU/mL)",
    "LH (Nam)": "mIU/mL (ví dụ: 4.8 mIU/mL)",
    
    // Female Health
    "Pap smear": "Bình thường / ASC-US / LSIL / HSIL / ASC-H / AGC",
    "HPV Genotyping": "Dương tính / Âm tính (genotype: 16, 18, 31, 33...)",
    "Estrogen": "pg/mL (ví dụ: 150 pg/mL)",
    "Progesterone": "ng/mL (ví dụ: 2.5 ng/mL)",
    "FSH (Nữ)": "mIU/mL (ví dụ: 6.5 mIU/mL)",
    "LH (Nữ)": "mIU/mL (ví dụ: 8.2 mIU/mL)",
    "AMH (Anti-Müllerian Hormone)": "ng/mL (ví dụ: 2.1 ng/mL)",
    "Beta HCG": "mIU/mL (ví dụ: <5 mIU/mL)",
    
    // General Health
    "Công thức máu (CBC)": "Hồng cầu: X triệu/μL, Bạch cầu: X nghìn/μL, Tiểu cầu: X nghìn/μL, Hemoglobin: X g/dL",
    "Đường huyết": "mg/dL (ví dụ: 95 mg/dL)",
    "Mỡ máu": "Cholesterol toàn phần: X mg/dL, HDL: X mg/dL, LDL: X mg/dL, Triglyceride: X mg/dL",
    "Chức năng gan": "ALT: X U/L, AST: X U/L, Bilirubin: X mg/dL, Albumin: X g/dL",
    "Chức năng thận": "Creatinine: X mg/dL, BUN: X mg/dL, eGFR: X mL/min/1.73m²",
    "Tổng phân tích nước tiểu": "pH: X, Tỷ trọng: X, Protein: Âm tính/Dương tính, Glucose: Âm tính/Dương tính",
    "Viêm gan B": "HBsAg: Dương tính/Âm tính, Anti-HBs: Dương tính/Âm tính",
    "Viêm gan C": "Anti-HCV: Dương tính/Âm tính, HCV RNA: Dương tính/Âm tính",
    "Chức năng tuyến giáp": "TSH: X μIU/mL, T4: X μg/dL, T3: X ng/dL",
    
    // Prevention
    "Sàng lọc trước PrEP": "HIV: Âm tính, Creatinine: X mg/dL, Hepatitis B: Âm tính",
    "Theo dõi PEP": "HIV: Âm tính, Creatinine: X mg/dL, Các xét nghiệm khác...",
    "Định lượng kháng thể vaccine": "Định lượng kháng thể (ví dụ: >10 mIU/mL)",
    "Lao phổi": "PPD: Âm tính/Dương tính, X-quang: Bình thường/Bất thường",
    
    // Cancer Screening
    "Sàng lọc ung thư tuyến tiền liệt": "PSA: X ng/mL, PSA Free: X ng/mL, Tỷ lệ Free/Total: X%",
    "Sàng lọc ung thư cổ tử cung": "Pap smear: Bình thường/ASC-US/LSIL/HSIL, HPV: Âm tính/Dương tính",
    "Sàng lọc ung thư vú": "Mammography: Bình thường/Bất thường, Siêu âm: Bình thường/Bất thường",
    "Sàng lọc ung thư đại trực tràng": "FOBT: Âm tính/Dương tính, Colonoscopy: Bình thường/Bất thường"
  };
  
  return placeholders[testName] || "Nhập kết quả xét nghiệm...";
};

const CreateMedicalTestModal = ({ visible, onOk, onCancel, appointmentId }) => {
  const [form] = Form.useForm();
  const [selectedTestName, setSelectedTestName] = useState(null);
  const [medicalTests, setMedicalTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Fetch danh sách xét nghiệm từ API
  const fetchMedicalTests = async () => {
    setLoading(true);
    try {
      const data = await provideMedicalTestApi.getAllMedicalTests();
      setMedicalTests(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xét nghiệm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        appointmentId,
        testDate: dayjs(), // mặc định là ngày hiện tại
      });
      setSelectedTestName(null);
      setSelectedTest(null);
      fetchMedicalTests();
    }
  }, [visible, appointmentId, form]);

  const handleTestNameChange = (value) => {
    setSelectedTestName(value);
    // Tìm thông tin xét nghiệm được chọn
    const selectedTestData = medicalTests.find(test => test.testName === value);
    setSelectedTest(selectedTestData);
    
    // Tự động điền giá nếu có
    if (selectedTestData) {
      form.setFieldsValue({
        price: selectedTestData.price
      });
    }
  };

  return (
    <Modal
      open={visible}
      title="Thêm xét nghiệm mới"
      onOk={() => form.validateFields().then(onOk)}
      onCancel={onCancel}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="appointmentId" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="Tên xét nghiệm"
          name="testName"
          rules={[{ required: true, message: "Vui lòng chọn tên xét nghiệm" }]}
        >
          <Select 
            placeholder="Chọn tên xét nghiệm"
            showSearch
            onChange={handleTestNameChange}
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy xét nghiệm"}
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {medicalTests.map(test => (
              <Option key={test.id} value={test.testName}>
                <div>
                  <div className="font-medium">{test.testName} - {test.price} VND</div>
                  
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedTest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-1">Thông tin xét nghiệm:</div>
              <div className="text-blue-600">{selectedTest.description}</div>
              <div className="text-blue-600 mt-1">
                Giá: {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedTest.price)}
              </div>
            </div>
          </div>
        )}

        <Form.Item
          label="Ngày xét nghiệm"
          name="testDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày xét nghiệm" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Kết quả"
          name="result"
          rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
        >
          <Input 
            placeholder={selectedTestName ? getResultPlaceholder(selectedTestName) : "Nhập kết quả xét nghiệm..."}
          />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="notes"
        >
          <Input.TextArea rows={3} placeholder="Ghi chú bổ sung..." />
        </Form.Item>

        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber 
            min={0} 
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder="Nhập giá xét nghiệm..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMedicalTestModal;