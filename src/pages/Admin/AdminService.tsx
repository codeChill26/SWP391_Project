import { useEffect, useState } from "react";
import { serviceApi } from "../../api/service-api";

export const AdminService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fetchServices = async () => {
    const response = await serviceApi.getServices();
    setServices(response);
  };
  useEffect(() => {
    fetchServices();
  }, []);


}