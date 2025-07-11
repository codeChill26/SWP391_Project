
import { FaSearch, FaCalendarAlt, FaDollarSign, FaClock, FaUsers, FaChartLine, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { appointmentApi } from "../../api/appointment-api";
import { serviceApi } from "../../api/service-api";
import axios from "axios";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, servicesData] = await Promise.all([
          appointmentApi.getAppointments(),
          serviceApi.getServices()
        ]);
        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    if (!appointments.length || !services.length) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    // Filter appointments
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentTime);
      return aptDate >= today;
    });

    const weekAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentTime);
      return aptDate >= thisWeek;
    });

    const monthAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentTime);
      return aptDate >= thisMonth;
    });

    // Status counts
    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {});

    // Service statistics
    const serviceStats = appointments.reduce((acc, apt) => {
      const service = services.find(s => s.id === apt.serviceId);
      if (service) {
        if (!acc[service.id]) {
          acc[service.id] = {
            name: service.name,
            count: 0,
            revenue: 0,
            type: service.type
          };
        }
        acc[service.id].count++;
        if (apt.status === 'COMPLETED') {
          acc[service.id].revenue += service.price;
        }
      }
      return acc;
    }, {});

    // Top services by count
    const topServices = Object.values(serviceStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue calculation
    const totalRevenue = appointments
      .filter(apt => apt.status === 'COMPLETED')
      .reduce((sum, apt) => {
        const service = services.find(s => s.id === apt.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    const todayRevenue = todayAppointments
      .filter(apt => apt.status === 'COMPLETED')
      .reduce((sum, apt) => {
        const service = services.find(s => s.id === apt.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    // Type distribution
    const typeDistribution = Object.values(serviceStats).reduce((acc, service) => {
      acc[service.type] = (acc[service.type] || 0) + service.count;
      return acc;
    }, {});

    return {
      totalAppointments: appointments.length,
      todayAppointments: todayAppointments.length,
      weekAppointments: weekAppointments.length,
      monthAppointments: monthAppointments.length,
      statusCounts,
      topServices,
      totalRevenue,
      todayRevenue,
      typeDistribution,
      averageRevenue: totalRevenue / (statusCounts.COMPLETED || 1)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <AdminLayout activeMenu="admin/dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeMenu="admin/dashboard">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeMenu="admin/dashboard">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Tổng quan hoạt động hệ thống</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaClock className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaHourglassHalf className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.statusCounts?.PENDING || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaDollarSign className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRevenue?.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố trạng thái</h3>
            <div className="space-y-3">
              {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      status === 'COMPLETED' ? 'bg-green-500' :
                      status === 'PENDING' ? 'bg-yellow-500' :
                      status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top dịch vụ</h3>
            <div className="space-y-3">
              {stats.topServices?.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{service.count}</div>
                    <div className="text-xs text-gray-500">{service.revenue?.toLocaleString()} VNĐ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê tuần</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.weekAppointments}</div>
            <p className="text-sm text-gray-600">Lịch hẹn trong 7 ngày qua</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê tháng</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.monthAppointments}</div>
            <p className="text-sm text-gray-600">Lịch hẹn trong 30 ngày qua</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu hôm nay</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.todayRevenue?.toLocaleString()} VNĐ
            </div>
            <p className="text-sm text-gray-600">Tổng doanh thu hôm nay</p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Lịch hẹn gần đây</h3>
            <button
              onClick={() => navigate("/admin/appointments")}
              className="text-blue-500 text-sm font-medium hover:text-blue-600"
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.slice(0, 5).map((appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  const date = new Date(appointment.appointmentTime);
                  
                  return (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service?.price?.toLocaleString()} VNĐ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
