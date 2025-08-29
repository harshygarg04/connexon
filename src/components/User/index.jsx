import React, { useEffect, useState } from "react";
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
        status: user.status || "active",
        phone: phones[0]?.phone_number || "",
        phone_id: phones[0]?.id || null,  // keep id for updates
        otherPhones: phones.slice(1).map((p) => ({
          id: p.id,
          phone_number: p.phone_number,
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
      if (modalType === "add") {
        // Create payload
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
        }
      }
      else if (modalType === "edit") {
        // ✅ Only mandatory fields
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
        if (modalType === "add" && !currentUser.password?.trim()) {
          toast.error("Password is required");
          return;
        }


        const payload = {};

        // Include optional fields only if they are not empty
        if (currentUser.first_name !== originalUser.first_name) {
          payload.first_name = currentUser.first_name;
        }

        if (currentUser.middle_name !== originalUser.middle_name) {
          payload.middle_name = currentUser.middle_name?.trim() || "";  // allow blank
        }

        if (currentUser.last_name !== originalUser.last_name) {
          payload.last_name = currentUser.last_name?.trim() || "";     // allow blank
        }

        if (currentUser.email !== originalUser.email) {
          payload.email = currentUser.email;
        }

        if (currentUser.dob !== originalUser.dob) {
          payload.dob = currentUser.dob?.trim() || "";              // allow null/empty
        }

        if (currentUser.address !== originalUser.address) {
          payload.address = currentUser.address?.trim() || "";        // allow blank
        }

        // Phones (if changed)
        if (
          currentUser.phone !== originalUser.phone ||
          JSON.stringify(currentUser.otherPhones) !==
          JSON.stringify(originalUser.otherPhones)
        ) {
          payload.phone_numbers = [];

          // main phone
          if (originalUser.phone_id) {
            payload.phone_numbers.push({
              id: originalUser.phone_id,
              country_code: "+91",
              phone_number: currentUser.phone,
            });
          } else {
            payload.phone_numbers.push({
              country_code: "+91",
              phone_number: currentUser.phone,
            });
          }

          // other phones
          currentUser.otherPhones.forEach((num, i) => {
            const existing = originalUser.otherPhones[i];
            const phone_number = typeof num === "string" ? num : num.phone_number;
            if (phone_number?.trim() !== "") {
              payload.phone_numbers.push({
                id: existing?.id,
                country_code: "+91",
                phone_number,
              });
            }
          });
        }

        console.log("Sending payload:", payload);

        // ... rest of your API call
        const res = await axiosInstance.put(
          `/api/admin/user/update/${currentUser.id}`,
          payload
        );

        const updatedUser = res.data.data; // backend sends full profile

        // Normalize backend response again for frontend
        const phones = updatedUser.phone_numbers || [];
        const normalizedUser = {
          phone: phones[0]?.phone_number || "",
          phone_id: phones[0]?.id || null,
          otherPhones: phones.slice(1).map((p) => ({
            id: p.id,
            phone_number: p.phone_number,
          })),
        };

        // Merge into users state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUser.id ? { ...u, ...normalizedUser } : u
          )
        );
        toast.success(res.data?.message || "User updated successfully!");
      }
      closeModal();
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
      const payload = { status: newStatus };

      const res = await axiosInstance.put(
        `/api/admin/user/update/${user.id}`,
        payload
      );

      // Sync with backend response
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: res.data.data.status } : u
        )
      );

      // ✅ Custom toast messages
      if (res.data?.data?.status === "blocked") {
        toast.success("User blocked successfully!");
      } else if (res.data?.data?.status === "active") {
        toast.success("User unblocked successfully!");
      }
    } catch (e) {
      console.error("❌ Toggle failed:", e.response?.data || e);

      // Rollback UI change
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
      );

      // ❌ Error toast
      toast.error(
        e.response?.data?.message || "Failed to update user status"
      );
    }
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
              <th>Plan</th>
              <th>User</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter((u) =>
              [u.first_name, u.middle_name, u.last_name]
                .filter(Boolean) // remove null/undefined/empty
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
            ).length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No user found
                </td>
              </tr>


            ) : (
              users
                .filter((u) => `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()))
                .map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input type="checkbox" checked={user.selected} onChange={() => handleSelectUser(user.id)} />
                    </td>
                    <td>{user.id}</td>
                    <td className="name-wrap">
                      <div className="name-text">
                        {user.full_name ||
                          [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ")}
                      </div>
                    </td>
                    <td className="name-wrap"><div
                      className="name-text"
                    >{user.email}</div> </td>
                    <td>{user.phone || "N/A"}</td>
                    <td>{user.plan_details?.name || "N/A"}</td>
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
            <p><b>Email:</b> {currentUser.email}</p>
            <p><b>Date Of Birth:</b> {currentUser.dob || "N/A"}</p>
            <p><b>Address:</b> {currentUser.address || "N/A"}</p>
            <p><b>Plan:</b> {currentUser.plan_details?.name || "N/A"}</p>
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
