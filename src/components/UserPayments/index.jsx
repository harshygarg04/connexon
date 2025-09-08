import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Wrapper from './style';
import jsPDF from 'jspdf';
import axiosInstance from "../../axios/axiosInstance";
import Loader from "../../components/Loader"

const UserPayments = () => {
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPayments = async () => {
            try {
                const res = await axiosInstance.get("/api/admin/user"); // fetch all users
                if (res.data?.data) {
                    const mapped = res.data.data.flatMap(user =>
                        (user.all_payments || []).map(payment => ({
                            id: payment.id,
                            userId: user.id,
                            userName: user.full_name,
                            planName: payment.plan_name || "-",
                            planId: payment.plan_id,
                            status: payment.status === "paid" ? "Success" :
                                payment.status === "pending" ? "Pending" :
                                    payment.status === "failed" ? "Failed" : payment.status,
                            amount: payment.amount,
                            method: payment.payment_method,
                            transactionId: payment.gateway_payment_id || `PAY-${payment.id}`,
                            transactionDate: payment.paid_at ? new Date(payment.paid_at).toISOString().split("T")[0] : "-",
                            validityStart: payment.plan_start_date ? new Date(payment.plan_start_date).toISOString().split("T")[0] : "-",
                            validityEnd: payment.plan_end_date ? new Date(payment.plan_end_date).toISOString().split("T")[0] : "-",
                            selected: false,
                        }))
                    );

                    setPayments(mapped);
                }
            } catch (err) {
                console.error("❌ Failed to fetch payments:", err.response?.data || err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axiosInstance.get("/api/admin/plans");
                if (res.data?.data) {
                    setPlans(res.data.data); // full objects: id, name, etc.
                }
            } catch (err) {
                console.error("❌ Failed to fetch plans :", err.response?.data || err);
            }
        };

        fetchPlans();
    }, []);

    const handleView = (payment) => {
        setSelectedPayment(payment);
    };

    const closeModal = () => {
        setSelectedPayment(null);
    };


    const handleSelectPayment = (id) => {
        setPayments((prev) =>
            prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
        );
    };

    const handleDelete = (id) => {
        setPayments((prev) => prev.filter((p) => p.id !== id));
    };
    const [filterType, setFilterType] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [subFilterOpen, setSubFilterOpen] = useState('');
    const planOptions = [...new Set(payments.map(p => p.planName))];
    // const [activeFilter, setActiveFilter] = useState(null);
    // const handleFilterClick = (filterKey) => {
    //     setActiveFilter(prev => (prev === filterKey ? null : filterKey)); // toggle on click
    // };


    const filterRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
                setSubFilterOpen('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleBulkDelete = () => {
        const selectedIds = payments.filter((p) => p.selected).map((p) => p.id);
        setPayments((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Payment Invoice', 20, 20);
        doc.setDrawColor(0);
        doc.line(20, 25, 190, 25); // horizontal line

        // Content
        doc.setFontSize(12);
        let y = 40;

        const fields = [
            ['User ID', selectedPayment.userId],
            ['User Name', selectedPayment.userName],
            ['Plan ID', selectedPayment.planId],
            ['Plan Name', selectedPayment.planName],
            ['Plan Validity', `${selectedPayment.validityStart} to ${selectedPayment.validityEnd}`],
            ['Transaction ID', selectedPayment.transactionId],
            ['Transaction Date', selectedPayment.transactionDate],
            ['Paid Via', selectedPayment.method],
            ['Amount Paid', `${selectedPayment.amount}`],
            ['Status', selectedPayment.status],
        ];

        fields.forEach(([label, value]) => {
            doc.setTextColor(60, 60, 60);
            doc.text(`${label}:`, 25, y);

            doc.setTextColor(20, 20, 20);
            doc.text(`${value}`, 80, y); // aligned on right side
            y += 10;
        });


        // Footer / Thank you
        doc.setTextColor(100);
        doc.setFontSize(11);
        doc.text('Thank you for your payment!', 105, 280, { align: 'center' });

        // Save as PDF
        doc.save(`Invoice_${selectedPayment.transactionId}.pdf`);
    };
    if (loading) return <Loader loading={loading} />;
    return (
        <Wrapper>
            <div className="table-header">
                <section className="users">
                    <h1>User Plans&Payments</h1>
                    <div className="search-container">

                        <input
                            type="text"
                            placeholder="Search by User Name or Transaction ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>
                    <div className="filter-wrapper" style={{ position: 'relative' }} ref={filterRef}>
                        <div className="filter-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {filterType && filterValue && (
                                <button
                                    className="clear-btn"
                                    onClick={() => {
                                        setFilterType('');
                                        setFilterValue('');
                                    }}
                                >
                                    Clear
                                </button>
                            )}

                            <button
                                className="filter-btn"
                                onClick={() => setFilterOpen((prev) => !prev)}
                            >
                                Filter ⏷
                            </button>
                        </div>

                        {filterOpen && (
                            <div
                                className="filter-dropdown"
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: 0,
                                    zIndex: 1000,
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '8px',
                                    minWidth: '160px',
                                }}
                            >
                                {subFilterOpen ? (
                                    <div className="sub-menu">
                                        <div
                                            style={{ fontWeight: 'bold', marginBottom: '6px', cursor: 'pointer' }}
                                            onClick={() => setSubFilterOpen('')}
                                        >
                                            ⬅
                                        </div>
                                        {subFilterOpen === 'status' &&
                                            ['Success', 'Pending', 'Failed', 'Refunded'].map((status) => (
                                                <div
                                                    key={status}
                                                    onClick={() => {
                                                        setFilterType('status');
                                                        setFilterValue(status);
                                                        setFilterOpen(false);
                                                        setSubFilterOpen('');
                                                    }}
                                                >
                                                    {status}
                                                </div>
                                            ))}

                                        {subFilterOpen === 'planName' &&
                                            [...new Set(payments.map(p => p.planName))].map((plan) => (
                                                <div
                                                    key={plan}
                                                    onClick={() => {
                                                        setFilterType('planName');
                                                        setFilterValue(plan);
                                                        setFilterOpen(false);
                                                        setSubFilterOpen('');
                                                    }}
                                                >
                                                    {plan}
                                                </div>
                                            ))}

                                        {subFilterOpen === 'method' &&
                                            [...new Set(payments.map(p => p.method))].map((method) => (
                                                <div
                                                    key={method}
                                                    onClick={() => {
                                                        setFilterType('method');
                                                        setFilterValue(method);
                                                        setFilterOpen(false);
                                                        setSubFilterOpen('');
                                                    }}
                                                >
                                                    {method}
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="filter-option" onClick={() => setSubFilterOpen('status')}>
                                            By Status
                                        </div>
                                        <div className="filter-option" onClick={() => setSubFilterOpen('planName')}>
                                            By Plan
                                        </div>
                                        <div className="filter-option" onClick={() => setSubFilterOpen('method')}>
                                            Paid Via
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>


                    <div className="button-placeholder">
                        <button
                            className="bulk-delete-btn"
                            onClick={handleBulkDelete}
                            disabled={!payments.some((p) => p.selected)}
                            style={{
                                visibility: payments.some((p) => p.selected)
                                    ? 'visible'
                                    : 'hidden',
                            }}
                        >
                            Delete <MdDelete size={20} />
                        </button>
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
                                        setPayments((prev) =>
                                            prev.map((p) => ({ ...p, selected: e.target.checked }))
                                        )
                                    }
                                    checked={payments.length > 0 && payments.every((p) => p.selected)}
                                />
                            </th>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Plan Name</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments
                            .filter((p) =>
                                (
                                    p.userName.toLowerCase().includes(search.toLowerCase()) ||
                                    p.transactionId.toLowerCase().includes(search.toLowerCase())
                                ) &&
                                (filterType && filterValue ? p[filterType].toLowerCase() === filterValue.toLowerCase() : true)
                            ).length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">No details found</td>
                            </tr>
                        ) : (
                            payments
                                .filter((p) =>
                                    (
                                        p.userName.toLowerCase().includes(search.toLowerCase()) ||
                                        p.transactionId.toLowerCase().includes(search.toLowerCase())
                                    ) &&
                                    (filterType && filterValue ? p[filterType].toLowerCase() === filterValue.toLowerCase() : true)
                                )
                                .map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={payment.selected}
                                                onChange={() => handleSelectPayment(payment.id)}
                                            />
                                        </td>
                                        <td>{payment.userId}</td>
                                        <td className="name-wrap">
                                            <div className="name-text">{payment.userName}</div>
                                        </td>
                                        <td>{payment.planName}</td>
                                        <td className={
                                            payment.status === "Success"
                                                ? "status success"
                                                : payment.status === "Pending"
                                                    ? "status pending"
                                                    : "status failed"
                                        }>
                                            {payment.status}
                                        </td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleView(payment)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>

                </table>
            </div>

            {selectedPayment && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-scroll">
                            <h3 style={{ textAlign: 'center' }}>Payment Details</h3>
                            {[
                                { label: 'User ID', value: selectedPayment.userId },
                                { label: 'User Name', value: selectedPayment.userName },
                                // { label: 'Plan ID', value: selectedPayment.planId },
                                { label: 'Plan Name', value: selectedPayment.planName },
                                { label: 'Validity Start', value: selectedPayment.validityStart },
                                { label: 'Validity End', value: selectedPayment.validityEnd },
                                { label: 'Transaction ID', value: selectedPayment.transactionId },
                                { label: 'Transaction Date', value: selectedPayment.transactionDate },
                                { label: 'Paid Via', value: selectedPayment.method },
                                { label: 'Amount Paid', value: `₹${selectedPayment.amount}` },
                                { label: 'Status', value: selectedPayment.status },
                            ].map((item, idx) => (
                                <div className="detail-row" key={idx}>
                                    <span className="detail-label">{item.label}:</span>
                                    <span className="detail-value">{item.value}</span>
                                </div>
                            ))}

                            <div className="modal-buttons">
                                <div className="newsavebtn">
                                    <button className="download-btn" onClick={downloadInvoice}>
                                        Download Invoice
                                    </button>
                                </div>
                                <div className="newclosebtn">
                                    <button onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

export default UserPayments;
