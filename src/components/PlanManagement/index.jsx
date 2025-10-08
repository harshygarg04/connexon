import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { MdAddCircle, MdDelete } from 'react-icons/md';
import axiosInstance from '../../axios/axiosInstance';
import Wrapper from './style';
import Loader from "../../components/Loader";
import ActionLoader from "../../components/ActionLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';



const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState('');
  const [currentPlan, setCurrentPlan] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempPlan, setTempPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 🔹 Fetch all plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/plans");
        console.log(res.data);
        setPlans(res.data.data || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 🔹 Toggle plan status

  const handleToggleStatus = async (plan) => {
    try {
      const token = localStorage.getItem("token");

      // Flip status
      const newStatus = !plan.is_active;
      const payload = {
        ...plan,
        is_active: newStatus,
      };

      // Call backend
      await axiosInstance.put(`/api/admin/plans/${plan.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state manually
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, is_active: newStatus } : p))
      );

      // ✅ Show toast message
      if (newStatus) {
        toast.success("Plan enabled successfully!");
      } else {
        toast.success("Plan disabled successfully!");
      }
    } catch (error) {
      console.error("❌ Error toggling status:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };


  // 🔹 Open modal
  const openModal = (type, plan = {}) => {
    setModalType(type);
    if (type === 'edit') {
      setCurrentPlan(plan);
      setTempPlan(plan);
      setIsEditing(false);
    } else if (type === 'add') {
      setTempPlan({ name: '', description: 'No description provided', price: '', duration_in_days: '', features: [], is_active: true });
    }
  };

  const closeModal = () => {
    setModalType('');
    setCurrentPlan({});
    setTempPlan({});
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempPlan(currentPlan);
  };

  // 🔹 Select checkbox
  const handleSelectPlan = (id) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };
  const handleBulkDeleteWithConfirm = () => {
    const selectedIds = plans.filter((p) => p.selected).map((p) => p.id);


    if (!selectedIds.length) {
      toast.error("No plans selected to delete");
      return;
    }

    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${selectedIds.length} plan(s)?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => handleBulkDelete()
        },
        {
          label: "No",
          onClick: () => {
            //toast.info("Bulk delete cancelled");
          }
        }
      ]
    });
  };
  ;



  // // 🔹 Delete plan
  // const handleDelete = async (id) => {
  //   setActionLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axiosInstance.delete(`/api/admin/plans/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setPlans((prev) => prev.filter((p) => p.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting plan:", error);
  //   }   finally {
  //     setActionLoading(false); // hide loader
  //   }
  // };

  // 🔹 Bulk delete (loop since no bulk API for plans)
  const handleBulkDelete = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const selectedIds = plans.filter((p) => p.selected).map((p) => p.id);

      if (!selectedIds.length) {
        toast.error("No plans selected to delete");
        setActionLoading(false);
        return;
      }

      await Promise.all(
        selectedIds.map((id) =>
          axiosInstance.delete(`/api/admin/plans/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setPlans((prev) => prev.filter((p) => !selectedIds.includes(p.id)));

      // ✅ Success toast
      toast.success(`${selectedIds.length} plan(s) deleted successfully!`);
    } catch (error) {
      console.error("Error deleting selected plans:", error);

      // ❌ Error toast
      toast.error(error.response?.data?.message || "Failed to delete selected plans");
    } finally {
      setActionLoading(false);
    }
  };


  // 🔹 Save plan (create or update)


  const handleSavePlan = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...tempPlan,
        price: Number(tempPlan.price) || 0,
        duration_in_days: Number(tempPlan.duration_in_days) || 0,
        description: tempPlan.description?.trim() || "No description provided",
        features: Array.isArray(tempPlan.features)
          ? tempPlan.features
            .map(f => f.trim())                // trim around, keep inner spaces
            .filter(f => f !== "")             // remove empty
          : (typeof tempPlan.features === "string" && tempPlan.features.trim() !== "")
            ? tempPlan.features
              .split(",")
              .map(f => f.trim())              // trim each, preserve inner spaces
              .filter(f => f !== "")
            : []

      };

      if (modalType === "add") {
        // ✅ Add plan
        const res = await axiosInstance.post("/api/admin/plans/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlans(prev => [...prev, res.data.data]);
        toast.success("Plan added successfully!");
      } else {
        // ✅ Edit plan
        await axiosInstance.put(`/api/admin/plans/${tempPlan.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlans(prev =>
          prev.map(p => (p.id === tempPlan.id ? { ...p, ...payload } : p))
        );
        setCurrentPlan(prev => ({ ...prev, ...payload }));

        toast.success("Plan updated successfully!");
      }

      closeModal();
    } catch (error) {
      console.error("❌ Error saving plan:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save plan");
    } finally {
      setIsEditing(false);
      setModalType("");
      setActionLoading(false);
    }
  };



  if (loading) return <Loader loading={loading} />;
  return (
    <Wrapper>
      <div className="table-header">
        <section className="users">
          <h1>Plan Management</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="button-wrapper">
            <div className="button-placeholder">
              <button
                className="bulk-delete-btn"
                onClick={handleBulkDeleteWithConfirm}
                disabled={!plans.some((p) => p.selected)}
                style={{ visibility: plans.some((p) => p.selected) ? 'visible' : 'hidden' }}
              >
                Delete <MdDelete size={26} />
              </button>
              <button className="add-btn" onClick={() => openModal('add')}>
                Add <MdAddCircle size={26} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setPlans((prev) =>
                      prev.map((p) => ({ ...p, selected: e.target.checked }))
                    )
                  }
                  checked={plans.length > 0 && plans.every((p) => p.selected)}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.filter((p) =>
              (p.name || "").toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                  No plans found.
                </td>
              </tr>
            ) : (
              plans
                .filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()))
                .map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={plan.selected || false}
                        onChange={() => handleSelectPlan(plan.id)}
                      />
                    </td>
                    <td>{plan.id}</td>
                    <td>{plan.name}</td>
                    <td>₹{plan.price}</td>
                    <td>{plan.duration_in_days} days</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={plan.is_active}
                          onChange={() => handleToggleStatus(plan)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openModal('edit', plan)}
                      >
                        <FaEdit size={20} /> View/Edit
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-scroll">
              <h3 style={{ textAlign: 'center' }}>
                {modalType === 'add' ? 'Add Plan' : isEditing ? 'Edit Plan' : 'Plan Details'}
              </h3>

              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={isEditing || modalType === 'add' ? tempPlan.name || '' : currentPlan.name || ''}
                  onChange={(e) => setTempPlan({ ...tempPlan, name: e.target.value })}
                  disabled={modalType !== 'add' && !isEditing}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={isEditing || modalType === 'add' ? tempPlan.price || '' : currentPlan.price || ''}
                  onChange={(e) => setTempPlan({ ...tempPlan, price: e.target.value })}
                  disabled={modalType !== 'add' && !isEditing}
                />
              </div>

              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={isEditing || modalType === 'add' ? tempPlan.duration_in_days || '' : currentPlan.duration_in_days || ''}
                  onChange={(e) => setTempPlan({ ...tempPlan, duration_in_days: e.target.value })}
                  disabled={modalType !== 'add' && !isEditing}
                />
              </div>

              <div className="form-group">
                <label>Features (comma separated)</label>
                <textarea
                  value={isEditing || modalType === 'add'
                    ? (Array.isArray(tempPlan.features) ? tempPlan.features.join("\n") : tempPlan.features || "")
                    : (currentPlan.features || []).join("\n")}
                  onChange={(e) =>
                    setTempPlan({ ...tempPlan, features: e.target.value})
                  }
                  disabled={modalType !== 'add' && !isEditing}
                  rows={4} style={{ resize: 'none', padding: '10px', fontSize: '16px', width: '90%', height: '200px' }}
                />

              </div>
              {/* <div className="form-group">
                <label>Description</label>
                <textarea
                  value={isEditing || modalType === 'add' ? tempPlan.description || '' : currentPlan.description || ''}
                  onChange={(e) => setTempPlan({ ...tempPlan, description: e.target.value })}
                  disabled={modalType !== 'add' && !isEditing}
                />
              </div> */}

              {/* <div className="form-group">
                <label>Status</label>
                <select
                  value={isEditing || modalType === 'add' ? tempPlan.is_active : currentPlan.is_active}
                  onChange={(e) => setTempPlan({ ...tempPlan, is_active: e.target.value === "true" })}
                  disabled={modalType !== 'add' && !isEditing}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div> */}

              <div className="modal-buttons">
                {modalType === 'add' && (
                  <>
                    <div className="newsavebtn"><button onClick={handleSavePlan}>Save</button></div>
                    <div className="newclosebtn"><button onClick={closeModal}>Close</button></div>
                  </>
                )}
                {modalType === 'edit' && !isEditing && (
                  <>
                    <div className="newsavebtn"><button onClick={() => setIsEditing(true)}>Edit</button></div>
                    <div className="newclosebtn"><button onClick={closeModal}>Close</button></div>
                  </>
                )}
                {modalType === 'edit' && isEditing && (
                  <>
                    <div className="newsavebtn"><button onClick={handleSavePlan}>Save</button></div>
                    <div className="newclosebtn"><button onClick={handleCancelEdit}>Cancel</button></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {actionLoading && <ActionLoader />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

    </Wrapper>
  );
};

export default PlanManagement;
