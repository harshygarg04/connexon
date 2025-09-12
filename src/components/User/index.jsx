import React, { useMemo, useEffect, useState } from "react";
import { FaSearch, FaEdit, FaEye } from "react-icons/fa";
import { MdAddCircle, MdDelete, MdClose, MdLockReset } from "react-icons/md";
import axiosInstance from "../../axios/axiosInstance";
import Wrapper from "./style"; // optional CSS wrapper
import Loader from "../../components/Loader";
import ActionLoader from "../../components/ActionLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';



const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState(""); // "add" | "edit" | "view"
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState({});


  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return []; // guard

    const q = (search || "").trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const nameParts = [
        u.full_name,
        u.first_name,
        u.middle_name,
        u.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const email = (u.email || "").toLowerCase();
      const phone = String(u.phone || "").toLowerCase();

      return nameParts.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [users, search]);

  // const fetchUpcomingPayments = async (userId) => {
  //   try {
  //     const res = await axiosInstance.get(`/api/admin/users/${userId}/upcoming-payments`);
  //     return res.data?.data || [];
  //   } catch (err) {
  //     console.error("❌ Fetch upcoming payments failed:", err);
  //     return [];
  //   }
  // };



  const handleDeleteWithConfirm = (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(id)   // <-- will run your real delete
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleBulkDeleteWithConfirm = () => {
    const ids = users.filter((u) => u.selected).map((u) => u.id);
    if (!ids.length) return;

    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${ids.length} users?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleBulkDelete()
        },
        {
          label: 'No'
        }
      ]
    });
  };

  // 🔹 1. Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/user");

        setUsers(
          (res.data?.data || []).map((u) => ({
            ...u,
            phone: u.phone_numbers?.[0]?.phone_number || "",
            otherPhones: u.phone_numbers?.slice(1) || [],
            selected: false,
          }))
        );
      } catch (err) {
        console.error("❌ Fetch users failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 2. Modal open/close
  const openModal = (type, user = {}) => {
    setModalType(type);

    if (type === "edit") {
      const phones = user.phone_numbers || [];
      const editableUser = {
        id: user.id,
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        address: user.address || "",
         event_name: user.event_name || "",  
        status: user.status || "active",
        phone: phones[0]?.phone_number || "",
        phone_id: phones[0]?.id || null,  // keep id for updates
        otherPhones: phones.slice(1).map((p) => ({
          id: p.id,
          phone_number: p.phone_number,
          isDeleted: false,
        })),
      };


      setCurrentUser(editableUser);
      setOriginalUser(editableUser);
    } else if (type === "view") {
      setCurrentUser(user);


    } else if (type === "add") {
      setCurrentUser({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        dob: "",
        address: "",
        phone: "",
        otherPhones: [],
        status: "active",
      });
    }
  };


  const closeModal = () => {
    setModalType("");
    setCurrentUser({});
  };

  // 🔹 3. Select user for bulk actions
  const handleSelectUser = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u))
    );
  };

  // 🔹 4. Save (create or update)
  const handleSaveUser = async () => {
    setActionLoading(true);

    try {
      // ---------------------- ADD USER ----------------------
      if (modalType === "add") {
        // Mandatory checks
        if (!currentUser.first_name.trim()) {
          toast.error("First Name is required");
          return;
        }
        if (!currentUser.email.trim()) {
          toast.error("Email is required");
          return;
        }
        if (!currentUser.phone.trim()) {
          toast.error("Phone number is required");
          return;
        }
        if (!currentUser.password?.trim()) {
          toast.error("Password is required");
          return;
        }

        const payload = {
          first_name: currentUser.first_name,
          middle_name: currentUser.middle_name,
          last_name: currentUser.last_name,
          email: currentUser.email,
          password: currentUser.password,
          dob: currentUser.dob,
          address: currentUser.address,
          phone_numbers: [
            { country_code: "+91", phone_number: currentUser.phone },
            ...(currentUser.otherPhones || []),
          ],
        };

        const res = await axiosInstance.post("/api/admin/user/create", payload);

        if (res.data?.data) {
          const created = res.data.data;
          setUsers((prev) => [
            {
              ...created,
              phone: created.phone_numbers?.[0]?.phone_number || "",
              otherPhones: (created.phone_numbers || []).slice(1) || [],
              selected: false,
            },
            ...prev,
          ]);

          toast.success(res.data?.message || "User added successfully!");
          closeModal();
        }
      }

      // ---------------------- EDIT USER ----------------------
      else if (modalType === "edit") {
        if (!currentUser.first_name.trim()) {
          toast.error("First Name is required");
          return;
        }
        if (!currentUser.email.trim()) {
          toast.error("Email is required");
          return;
        }
        if (!currentUser.phone.trim()) {
          toast.error("Phone number is required");
          return;
        }

        // Helper: convert empty string → null
        const toNull = (val) => (val && val.trim() ? val.trim() : null);

        const payload = {
          first_name: toNull(currentUser.first_name),
          middle_name: toNull(currentUser.middle_name),
          last_name: toNull(currentUser.last_name),
          email: toNull(currentUser.email),
          dob: toNull(currentUser.dob),
          address: toNull(currentUser.address),
          event_name: toNull(currentUser.event_name),
          phone_numbers: [
            {
              id: currentUser.phone_id, // primary phone (locked)
              country_code: currentUser.country_code || "+91",
              phone_number: currentUser.phone,
            },
            ...(currentUser.otherPhones || []).map((num) => {
              if (num.isDeleted) {
                return { id: num.id }; // ✅ only id → backend deletes
              }
              return {
                id: num.id || undefined,
                country_code: num.country_code || "+91",
                phone_number: toNull(num.phone_number),
              };
            }),

          ],
        };

        const res = await axiosInstance.put(
          `/api/admin/user/update/${currentUser.id}`,
          payload
        );

        const apiUser = res.data?.data ?? {};
        const phones = apiUser.phone_numbers || [];

        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUser.id
              ? {
                ...u,
                ...apiUser,
                dob: apiUser.dob ? apiUser.dob.split("T")[0] : "",
                phone: phones[0]?.phone_number || "",
                phone_id: phones[0]?.id ?? null,
                otherPhones: phones.slice(1),
                full_name: [
                  apiUser.first_name,
                  apiUser.middle_name,
                  apiUser.last_name,
                ]
                  .filter(Boolean)
                  .join(" "),
                event_name: apiUser.event_name || null,
              }
              : u
          )
        );

        toast.success(res.data?.message || "User updated successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("❌ Save failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setActionLoading(false);
    }
  };


  // 🔹 5. Delete one
  const handleDelete = async (id) => {

    setActionLoading(true);
    try {
      await axiosInstance.delete(`/api/admin/user/delete/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err);
      toast.error("Failed to delete user");

    }
    finally {
      setActionLoading(false); // hide loader
    }
  };

  // 🔹 6. Bulk delete
  const handleBulkDelete = async () => {
    const ids = users.filter((u) => u.selected).map((u) => u.id);
    if (!ids.length) return;

    setActionLoading(true);
    try {
      await axiosInstance.post(`/api/admin/user/mass-delete`, { user_ids: ids });
      toast.success("User deleted successfully!");
      setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));

    } catch (error) {
      console.error("❌ Bulk delete failed:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false); // hide loader
    }
  };

  // 🔹 7. Toggle active/inactive
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );

    try {
      const res = await axiosInstance.put(
        `/api/admin/user/status/${user.id}`,
        { status: newStatus }
      );

      // Sync with backend
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: res.data?.data?.status } : u
        )
      );

      // Toast
      if (res.data?.data?.status === "blocked") {
        toast.success("User blocked successfully!");
      } else if (res.data?.data?.status === "active") {
        toast.success("User unblocked successfully!");
      }
    } catch (e) {
      console.error("❌ Toggle failed:", e.response?.data || e);

      // Rollback on error
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
      );

      toast.error(e.response?.data?.message || "Failed to update user status");
    }
  };
  const handleRemovePhone = (index) => {
    setCurrentUser((prev) => {
      const updated = [...prev.otherPhones];
      const phoneToRemove = updated[index];

      if (phoneToRemove?.id) {
        // existing phone → mark deleted
        updated[index] = { ...phoneToRemove, isDeleted: true };
      } else {
        // new phone (no id yet) → remove completely
        updated.splice(index, 1);
      }

      return { ...prev, otherPhones: updated };
    });
  };



  // 🔹 8. Toggle QR Code status
  const handleToggleQrCodeStatus = async (user) => {
    // 🚫 Case 1: No QR ever generated
    // if (!user.active_qr_code || !user.active_qr_code.qr_code_data) {
    //   toast.error("This user has not generated a QR code yet. Enable/disable is not allowed.");
    //   return;
    // }

    // 🚫 Case 3: If QR was disabled in backend from start (not generated by user)
    if (user.active_qr_code.is_active === false) {
      toast.error("QR Code is disabled by system. Admin cannot change this status.");
      return;
    }

    // ✅ Case 2: Allow toggle only if user has generated a QR at least once
    const newDisabled = !user.active_qr_code.qr_disabled_by_admin;

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, active_qr_code: { ...u.active_qr_code, qr_disabled_by_admin: newDisabled } }
          : u
      )
    );

    try {
      const payload = { qr_disabled_by_admin: newDisabled };

      const res = await axiosInstance.put(
        `/api/admin/qr-codes/deactivate/${user.id}`,
        payload
      );
      console.log(res.data)
      // Sync with backend response if available
      if (res.data?.data?.active_qr_code) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, active_qr_code: res.data.data.active_qr_code } : u
          )
        );
      }

      // ✅ Success toast
      if (newDisabled) {
        toast.success("QR Code disabled successfully!");
      } else {
        toast.success("QR Code enabled successfully!");
      }
    } catch (err) {
      console.error("❌ QR toggle failed:", err);

      // Rollback if error
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, active_qr_code: { ...u.active_qr_code, qr_disabled_by_admin: !newDisabled } }
            : u
        )
      );

      toast.error("Failed to update QR Code status");
    }
  };


  // ----------------- UI -----------------
  if (loading) return <Loader loading={loading} />;

  return (
    <Wrapper>
      <div className="table-header">
        <section className="users">
          <h1>User Management</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="button-wrapper">
            <div className="button-placeholder">
              <button
                className="bulk-reset-btn"
                onClick={() => alert("Reset password sent (simulated).")}
                disabled={!users.some((u) => u.selected)}
                style={{ visibility: users.some((u) => u.selected) ? "visible" : "hidden" }}
              >
                Reset Password <MdLockReset size={26} />
              </button>
              <button
                className="bulk-delete-btn"
                onClick={handleBulkDeleteWithConfirm}
                disabled={!users.some((u) => u.selected)}
                style={{ visibility: users.some((u) => u.selected) ? "visible" : "hidden" }}
              >
                Delete <MdDelete size={26} />
              </button>
              <button className="add-btn" onClick={() => openModal("add")}>
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
                    setUsers((prev) => prev.map((u) => ({ ...u, selected: e.target.checked })))
                  }
                  checked={users.length > 0 && users.every((u) => u.selected)}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Reg. Phone</th>
              <th>Active Plan</th>
              <th>User</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No user found
                </td>
              </tr>


            ) : (

              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" checked={user.selected} onChange={() => handleSelectUser(user.id)} />
                  </td>
                  <td>{user.id}</td>
                  <td className="name-wrap">
                    <div className="name-text">
                      {[user.first_name, user.middle_name, user.last_name]
                        .filter(Boolean)
                        .join(" ") || user.full_name}
                    </div>
                  </td>
                  <td className="name-wrap"><div
                    className="name-text"
                  >{user.email}</div> </td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.plan_details?.name
                    || user.active_payments?.[0]?.plan_name
                    || user.all_payments?.[0]?.plan_name
                    || "N/A"}
                  </td>

                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.status === "active"}
                        onChange={() => handleToggleStatus(user)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.active_qr_code?.is_active && !user.active_qr_code?.qr_disabled_by_admin}
                        onClick={(e) => {
                          // Case 1: Never generated
                          if (!user.active_qr_code?.qr_code_data) {
                            e.preventDefault();
                            toast.error("This user has not generated a QR code yet. Enable/disable is not allowed.");
                            return;
                          }

                          // Case 2: System disabled
                          if (user.active_qr_code?.is_active === false) {
                            e.preventDefault();
                            toast.error("QR Code is disabled by system. Admin cannot change this status.");
                            return;
                          }
                        }}
                        // ✅ Only run toggle handler if QR code is valid
                        onChange={() => {
                          if (user.active_qr_code?.qr_code_data && user.active_qr_code?.is_active !== false) {
                            handleToggleQrCodeStatus(user);
                          }
                        }}
                      />
                      <span className="slider round"></span>
                    </label>


                  </td>
                  <td>
                    <div className="button">
                      <button className="view-btn" onClick={() => openModal("view", user)}>
                        <FaEye size={20} />
                      </button>
                      <button className="edit-btn" onClick={() => openModal("edit", user)}>
                        <FaEdit size={20} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteWithConfirm(user.id)}>
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {modalType === "view" && (
        <div className="modal">
          <div className="modal-content view-modal">
            <button className="close-icon" onClick={closeModal}>
              <MdClose size={22} />
            </button>
            <h3 className="view-title">User Details</h3>
            <p><b>User ID:</b> {currentUser.id}</p>
            <p><b>Name:</b> {currentUser.full_name}</p>
             <p><b>Event Name:</b> {currentUser.event_name || "N/A"}</p>
            <p><b>Email:</b> {currentUser.email}</p>
            <p><b>Date Of Birth:</b> {currentUser.dob || "N/A"}</p>
            <p><b>Address:</b> {currentUser.address || "N/A"}</p>
           
            <p><b>Active Plan:</b></p>
            
            {currentUser.plan_details?.name
              || currentUser.active_payments?.[0]?.plan_name
              || currentUser.all_payments?.[0]?.plan_name ? (
              <ul style={{ marginLeft: "20px" }}>
                <li>
                  <b>{currentUser.plan_details?.name
                    || currentUser.active_payments?.[0]?.plan_name
                    || currentUser.all_payments?.[0]?.plan_name}</b> <br />
                  <span>
                    Start: {new Date(currentUser.active_payments?.[0]?.plan_start_date
                      || currentUser.all_payments?.[0]?.plan_start_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span> |
                  <span>
                    End: {new Date(currentUser.active_payments?.[0]?.plan_end_date
                      || currentUser.all_payments?.[0]?.plan_end_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </li>
              </ul>
            ) : (
              <p style={{ marginLeft: "20px" }}>No active plan</p>
            )}



            <p><b>Upcoming Plans:</b></p>

            {currentUser.upcoming_payments?.length ? (
              <ul style={{ marginLeft: "20px" }}>
                {currentUser.upcoming_payments.map((p, i) => {
                  const start = new Date(p.plan_start_date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });
                  const end = new Date(p.plan_end_date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <li key={i}>
                      <b>{p.plan_name}</b> — {p.status} <br />
                      <span>Start: {start}</span> | <span>End: {end}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No upcoming plans</p>
            )}

            <p className="phone-row">
              <b>Other Numbers:</b>
              <span className="phone-grid">
                {currentUser.otherPhones?.length > 0
                  ? currentUser.otherPhones.map((p, i) => (
                    <span key={i} className="phone-item">
                      {p.country_code} {p.phone_number}
                    </span>
                  ))
                  : "N/A"}
              </span>
            </p>
            <p className="qr-row" style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
              {currentUser.active_qr_code?.qr_code_data ? (
                <>
                  <b
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      // background: "rgba(255,255,255,0.7)",
                      padding: "2px 6px",
                      fontSize: "15px",
                      borderRadius: "4px"
                    }}
                  >
                    QR Code:
                  </b>
                  <img
                    src={currentUser.active_qr_code.qr_code_data}
                    alt="User QR Code"
                    style={{ width: "150px", height: "150px", display: "block", marginLeft: "100px" }}
                  />
                </>
              ) : (
                <>
                  <b>QR Code:</b> <span>No QR code generated by this user</span>
                </>
              )}
            </p>


          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="modal">
          <div className="modal-content form-modal">
            <h3>{modalType === "add" ? "Add User" : "Edit User"}</h3>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={currentUser.first_name || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, first_name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Middle Name (optional)</label>
              <input
                type="text"
                value={currentUser.middle_name || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, middle_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name (optional)</label>
              <input
                type="text"
                value={currentUser.last_name || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, last_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={currentUser.email || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                required
              />
            </div>
            {modalType === "edit" && (
              <div className="form-group">
                <label>Event Name (optional)</label>
                <input
                  type="text"
                  value={currentUser.event_name || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, event_name: e.target.value })
                  }
                />
              </div>
            )}


            {modalType === "add" && (
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="tel"
                  value={currentUser.phone || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, phone: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Other Phone Numbers (optional)</label>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentUser({
                      ...currentUser,
                      otherPhones: [
                        ...(currentUser.otherPhones || []),
                        { country_code: "+91", phone_number: "" },
                      ],
                    })
                  }
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  ➕ Add
                </button>
              </div>

              {(currentUser.otherPhones?.length
                ? currentUser.otherPhones.filter((p) => !p.isDeleted) // hide deleted
                : [{ country_code: "+91", phone_number: "" }]
              ).map((num, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    marginTop: "5px",
                    width: "390px",
                  }}
                >
                  <input
                    type="tel"
                    value={num.phone_number || ""}
                    onChange={(e) => {
                      const newPhones = [...currentUser.otherPhones];
                      newPhones[index] = {
                        ...newPhones[index],
                        country_code: "+91",
                        phone_number: e.target.value,
                      };
                      setCurrentUser({ ...currentUser, otherPhones: newPhones });
                    }}
                    style={{ flex: 1, marginRight: "8px" }}
                  />

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(index)}
                      style={{
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0 8px",
                        cursor: "pointer",
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}

            </div>

            {modalType === "add" && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={currentUser.password || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, password: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Address (optional)</label>
              <input
                type="text"
                value={currentUser.address || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Date Of Birth (yyyy-mm-dd)Optional</label>
              <input
                type="text"
                value={currentUser.dob || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, dob: e.target.value })
                }
              />
            </div>

            <div className="newsavebtn">
              <button onClick={handleSaveUser}>Save</button>
            </div>
            <div className="newclosebtn">
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {actionLoading && <ActionLoader />}
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Wrapper>
  );
};
export default UserManagement;
