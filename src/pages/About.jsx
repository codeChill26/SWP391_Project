import { Flex, Image } from 'antd';
import React from 'react';
import { UserLayout } from '../layout/userLayout';
const baseStyle = {
  width: '50%',
  height: 54,
};

const About = () => {
  return (
    
      <UserLayout>
        <Flex gap="middle" vertical>
          <Flex >
            <div style={{
            
              width: "50%",

            }}>
              <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-6 md:px-20 text-gray-800 dark:text-white">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-300">Về Chúng Tôi</h1>
                  <p className="text-lg leading-relaxed mb-4">
                    Trung tâm Y Tế Tổng Hợp GALANT tự hào là một trong những phòng khám tiên phong tại Việt Nam trong lĩnh vực chăm sóc sức khỏe cộng đồng với đội ngũ y bác sĩ tận tâm, giàu kinh nghiệm và trang thiết bị hiện đại.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Chúng tôi chuyên cung cấp các dịch vụ khám và điều trị đa khoa, xét nghiệm chuyên sâu, tư vấn sức khỏe và các chương trình chăm sóc y tế toàn diện. Với phương châm “Sức khỏe của bạn là sứ mệnh của chúng tôi”, GALANT luôn đặt bệnh nhân làm trung tâm và không ngừng nâng cao chất lượng phục vụ.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Hệ thống phòng khám của chúng tôi hiện có mặt tại TP. Hồ Chí Minh và Hà Nội, thuận tiện cho việc di chuyển và đặt lịch hẹn. GALANT cam kết bảo mật thông tin bệnh nhân, tạo không gian khám chữa bệnh thân thiện, chuyên nghiệp và an toàn.
                  </p>
                </div>
              </div>
            </div>
            <div style={{
              
              width: "50%",
              height: "200px"
            }}>
              <Image
                width={600}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
          </Flex>
        </Flex>

      </UserLayout>

  );
};

export default About;
