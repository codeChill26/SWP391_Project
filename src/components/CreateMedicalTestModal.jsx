import { Modal, Form, Input, InputNumber, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

// Cấu trúc phân cấp các loại xét nghiệm
const testCategories = {
  "STD_TESTS": {
    label: "Xét nghiệm bệnh lây truyền qua đường tình dục",
    tests: [
      "HIV Combo (Kháng nguyên + Kháng thể)",
      "HIV Kháng thể",
      "Giang mai - VDRL",
      "Giang mai - TPHA",
      "Lậu - PCR",
      "Lậu - Nuôi cấy",
      "Chlamydia - PCR",
      "Herpes HSV-1",
      "Herpes HSV-2",
      "HPV (Papillomavirus)"
    ]
  },
  "HIV_MONITORING": {
    label: "Theo dõi điều trị HIV",
    tests: [
      "CD4 Count",
      "Tải lượng virus HIV",
      "Tỷ lệ CD4",
      "Tỷ lệ CD4/CD8",
      "Kháng thuốc HIV"
    ]
  },
  "MALE_HEALTH": {
    label: "Sức khỏe nam giới",
    tests: [
      "PSA Tổng",
      "PSA Tự do",
      "Tinh dịch đồ",
      "Testosterone",
      "Prolactin",
      "FSH (Nam)",
      "LH (Nam)"
    ]
  },
  "FEMALE_HEALTH": {
    label: "Sức khỏe nữ giới",
    tests: [
      "Pap smear",
      "HPV Genotyping",
      "Estrogen",
      "Progesterone",
      "FSH (Nữ)",
      "LH (Nữ)",
      "AMH (Anti-Müllerian Hormone)",
      "Beta HCG"
    ]
  },
  "GENERAL_HEALTH": {
    label: "Xét nghiệm tổng quát",
    tests: [
      "Công thức máu (CBC)",
      "Đường huyết",
      "Mỡ máu",
      "Chức năng gan",
      "Chức năng thận",
      "Tổng phân tích nước tiểu",
      "Viêm gan B",
      "Viêm gan C",
      "Chức năng tuyến giáp"
    ]
  },
  "PREVENTION": {
    label: "Dự phòng và tiêm chủng",
    tests: [
      "Sàng lọc trước PrEP",
      "Theo dõi PEP",
      "Định lượng kháng thể vaccine",
      "Lao phổi"
    ]
  },
  "CANCER_SCREENING": {
    label: "Sàng lọc ung thư",
    tests: [
      "Sàng lọc ung thư tuyến tiền liệt",
      "Sàng lọc ung thư cổ tử cung",
      "Sàng lọc ung thư vú",
      "Sàng lọc ung thư đại trực tràng"
    ]
  }
};

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

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        appointmentId,
        testDate: dayjs(), // mặc định là ngày hiện tại
      });
      setSelectedTestName(null);
    }
  }, [visible, appointmentId, form]);

  const handleTestNameChange = (value) => {
    setSelectedTestName(value);
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
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {Object.entries(testCategories).map(([categoryKey, category]) => (
              <Select.OptGroup key={categoryKey} label={category.label}>
                {category.tests.map(test => (
                  <Option key={test} value={test}>
                    {test}
                  </Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>

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
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMedicalTestModal;