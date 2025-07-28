import { Modal, List, Button } from "antd";
import { useEffect, useState } from "react";
import { testApi } from "../../api/test-api";

export const TestResultsDialog = ({ testResults }) => {
  //   const [open, setOpen] = useState(false);
  const [tests, setTest] = useState([]);
  //   const showModal = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  useEffect(() => {
    const fetchTest = async () => {
      const response = await testApi.getmedicaltestsByappointmentId(
        testResults.id
      );
      setTest(response);
    };
    fetchTest();
  }, [testResults]);

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Xem danh sách xét nghiệm
      </Button> */}

      <List
        dataSource={tests}
        bordered
        renderItem={(item) => (
          <List.Item key={item.testId}>
            <div className="w-full">
              <h3 className="text-lg font-semibold text-blue-600">
                {item.testName}
              </h3>
              <p>
                Ngày xét nghiệm:{" "}
                {new Date(item.testDate).toLocaleString("vi-VN")}
              </p>
              <p>Kết quả: {item.result}</p>
              <p>Ghi chú: {item.notes}</p>
              <p>Giá: {item.price.toLocaleString("vi-VN")} VND</p>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};
