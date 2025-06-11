import React from 'react';
import { Layout, Card, Avatar, Button, Table, Tag, Divider } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  AudioOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  StarOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const User = () => {
  // Sample data for recommended doctors
  const doctors = [
    {
      name: 'Amanda Clara',
      specialty: 'Palliatric',
      experience: '12 years',
      days: 'Tue, Thu',
      hours: '10:00 AM-01:00 PM',
      price: '$25',
      rating: 4.8
    },
    {
      name: 'Jason shatsky',
      specialty: 'Surgical',
      experience: '10 years',
      days: 'Tue, Thu',
      hours: '10:00 AM-01:00 PM',
      price: '$35',
      rating: 4.7
    },
    {
      name: 'Jessie dux',
      specialty: 'Gastroenterology',
      experience: '7 years',
      days: 'Tue, Thu',
      hours: '10:00 AM-01:00 PM',
      price: '$15',
      rating: 4.5
    }
  ];

  // Calendar data
  const calendarColumns = [
    { title: 'Mon', dataIndex: 'mon', key: 'mon' },
    { title: 'Tue', dataIndex: 'tue', key: 'tue' },
    { title: 'Wed', dataIndex: 'wed', key: 'wed' },
    { title: 'Thu', dataIndex: 'thu', key: 'thu' },
    { title: 'Fri', dataIndex: 'fri', key: 'fri' },
    { title: 'Sat', dataIndex: 'sat', key: 'sat' },
    { title: 'Sun', dataIndex: 'sun', key: 'sun' },
  ];

  const calendarData = [
    {
      key: '1',
      mon: '3', tue: '4', wed: '8', thu: '6', fri: '7', sat: '8', sun: '9'
    },
    {
      key: '2',
      mon: '10', tue: '11', wed: '12', thu: '13', fri: '14', sat: '15', sun: '16'
    },
    {
      key: '3',
      mon: '17', tue: '18', wed: '19', thu: '20', fri: '21', sat: '22', sun: '23'
    },
    {
      key: '4',
      mon: '24', tue: '25', wed: '26', thu: '27', fri: '28', sat: '29', sun: '30'
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        width={250}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
          padding: '20px 0'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ color: '#1890ff', fontSize: 24 }}>Healthi</h1>
        </div>
        
        {/* Services Section */}
        <div style={{ padding: '0 20px', marginBottom: 30 }}>
          <h3 style={{ color: '#1890ff' }}>Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button type="text" icon={<VideoCameraOutlined />} style={{ textAlign: 'left' }}>Video Consultation</Button>
            <Button type="text" icon={<MessageOutlined />} style={{ textAlign: 'left' }}>Text Consultation</Button>
            <Button type="text" icon={<AudioOutlined />} style={{ textAlign: 'left' }}>Audio Consultation</Button>
            <Button type="text" icon={<UserOutlined />} style={{ textAlign: 'left' }}>In-person Visit</Button>
          </div>
        </div>
        
        {/* Profile Section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Avatar size={40} src="https://randomuser.me/api/portraits/men/32.jpg" />
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontWeight: 'bold' }}>Stevan dux</div>
            <div style={{ fontSize: 12, color: '#888' }}>Patient</div>
          </div>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 1px 4px 0 rgba(0, 21, 41, 0.12)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome Back</h2>
            <div>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {/* Top Section */}
          <Card title="No need to visit local hospitals" bordered={false}>
            <h3>Get your consultation online</h3>
            <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
              <Tag icon={<VideoCameraOutlined />} color="blue">Video</Tag>
              <Tag icon={<MessageOutlined />} color="blue">Text</Tag>
              <Tag icon={<AudioOutlined />} color="blue">Audio</Tag>
              <Tag icon={<UserOutlined />} color="blue">In-person</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
              <span>180 doctors are online</span>
            </div>
          </Card>

          <Divider />

          {/* Nearby Doctors */}
          <Card title="Nearby Doctors" bordered={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <EnvironmentOutlined />
              <span>Please enable your location, so we can find nearby doctors</span>
              <Button type="primary" size="small">Enable Now!</Button>
            </div>
          </Card>

          <Divider />

          {/* Upcoming Appointments */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarOutlined />
                <span>Upcoming Appointments</span>
              </div>
            }
            extra={<span>June 2023 &gt;</span>}
            bordered={false}
          >
            <Table 
              columns={calendarColumns} 
              dataSource={calendarData} 
              pagination={false}
              showHeader={true}
              size="small"
              bordered={false}
            />
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              No upcoming appointments
            </div>
          </Card>

          <Divider />

          {/* Recommended Doctors */}
          <Card title="Recommended Doctors" bordered={false} extra={<a href="#">View All &gt;</a>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {doctors.map((doctor, index) => (
                <Card key={index} hoverable>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3>{doctor.name}</h3>
                      <div style={{ color: '#888' }}>{doctor.specialty}</div>
                      <div>{doctor.experience} experience</div>
                    </div>
                    <div>
                      <Tag icon={<StarOutlined />} color="gold">{doctor.rating}</Tag>
                    </div>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ marginBottom: 12 }}>
                    <div>{doctor.days}</div>
                    <div>{doctor.hours}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{doctor.price} <span style={{ fontWeight: 'normal' }}>Starting</span></span>
                    <Button type="primary">Book an appointment</Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default User;