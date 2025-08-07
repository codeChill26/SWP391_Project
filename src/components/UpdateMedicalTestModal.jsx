import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, message, Alert } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const UpdateMedicalTestModal = ({ visible, onOk, onCancel, medicalTest, providedMedicalTest }) => {
  const [form] = Form.useForm();
  const [autoNote, setAutoNote] = useState('');

  useEffect(() => {
    if (visible && medicalTest) {
      form.setFieldsValue({
        result: medicalTest.result || '',
        notes: medicalTest.notes || '',
      });
      setAutoNote('');
    }
  }, [visible, medicalTest, form]);

  // Hàm phân tích nội dung kết quả và tạo ghi chú tự động
  const handleResultChange = (value) => {
    if (!value || !medicalTest?.testName || !providedMedicalTest) {
      setAutoNote('');
      return;
    }

    let note = '';

    // Tìm số trong nội dung
    const numbers = value.match(/\d+(\.\d+)?/g);
    
    if (numbers && numbers.length > 0 && providedMedicalTest.min !== undefined && providedMedicalTest.max !== undefined) {
      // Có số và có khoảng chuẩn - so sánh số
      const numValue = parseFloat(numbers[0]);
      if (!isNaN(numValue)) {
        if (numValue < providedMedicalTest.min) {
          note = `⚠️ Kết quả thấp (${numValue} ${providedMedicalTest.unit || ''}) - ${providedMedicalTest.descriptionLow || ''}`;
        } else if (numValue > providedMedicalTest.max) {
          note = `⚠️ Kết quả cao (${numValue} ${providedMedicalTest.unit || ''}) - ${providedMedicalTest.descriptionHigh || ''}`;
        } else {
          note = `✅ Kết quả bình thường (${numValue} ${providedMedicalTest.unit || ''}) - Trong khoảng chuẩn ${providedMedicalTest.min}-${providedMedicalTest.max} ${providedMedicalTest.unit || ''}`;
        }
      }
    }

    setAutoNote(note);
    
    // Tự động cập nhật ghi chú trong form
    if (note) {
      form.setFieldsValue({ notes: note });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log("values", {
        ...medicalTest,
        result: values.result,
        notes: values.notes
      });
      // Gọi callback với dữ liệu đã cập nhật
      await onOk({
        ...medicalTest,
        result: values.result,
        notes: values.notes
      });

      
      form.resetFields();
      setAutoNote('');
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAutoNote('');
    onCancel();
  };

  return (
    <Modal
      title="Cập nhật kết quả xét nghiệm"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">{medicalTest?.testName}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ngày xét nghiệm: </span>
              <span>{medicalTest?.testDate ? new Date(medicalTest.testDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái: </span>
              <span className="text-green-600 font-semibold">Đã thanh toán</span>
            </div>
          </div>
        </div>

        <Form.Item
          label="Kết quả xét nghiệm (mô tả chi tiết)"
          name="result"
          rules={[
            { required: true, message: 'Vui lòng nhập kết quả xét nghiệm!' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết kết quả xét nghiệm..."
            showCount
            maxLength={500}
            onChange={(e) => handleResultChange(e.target.value)}
          />
        </Form.Item>

        {autoNote && (
          <Alert
            message="Ghi chú tự động"
            description={autoNote}
            type={autoNote.includes('⚠️') ? 'warning' : 'success'}
            showIcon
            className="mb-4"
          />
        )}

        <Form.Item
          label="Ghi chú"
          name="notes"
        >
          <TextArea
            rows={3}
            placeholder="Ghi chú sẽ được điền tự động dựa trên nội dung kết quả..."
            showCount
            maxLength={300}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMedicalTestModal; 