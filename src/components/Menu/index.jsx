import Wrapper from './style'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaUsers, FaCog, FaChartBar, FaShieldAlt, FaQrcode, FaLightbulb } from 'react-icons/fa'
import { MdEvent, MdPeople } from 'react-icons/md'
import { IoLogOut } from 'react-icons/io5'
import { FaCreditCard } from 'react-icons/fa';
//import { MdEvent } from 'react-icons/md';
//import { IoLogOut } from 'react-icons/io5';
import { FaBell } from 'react-icons/fa'



const Menu = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    const handleChange = (path) => {
        navigate(path)
    }

    const handleLogout = () => {
        // remove authentication token or flag
        localStorage.removeItem("authToken");
        localStorage.removeItem("auth"); // in case you’re still using this flag

        // redirect to login
        navigate("/login");
    };


    return (
        <Wrapper>
            <div className='menu-bar'>
                <div className='heading'>
                    <h1>Menu</h1>
                </div>
                <div className='content'>
                    {/* <div className={`dashboard ${currentPath === '/dashboard' ? 'selected' : ''}`} onClick={() => handleChange('/')}>
                        <FaHome size={24} />
                        <span>Dashboard</span>
                    </div> */}


                    <div className={`usermanagement ${currentPath === '/user' ? 'selected' : ''}`} onClick={() => handleChange('/user')}>
                        <FaUsers size={24} />
                        <span>Users</span>
                    </div>

                    <div
                        className={`planmanagement ${currentPath === '/plan-management' ? 'selected' : ''}`}
                        onClick={() => handleChange('/plan-management')}
                    >
                        <MdEvent size={24} />
                        <span>Plan Management</span>
                    </div>
                    <div
                        className={`UserPayments ${currentPath === '/User-Payments' ? 'selected' : ''}`}
                        onClick={() => handleChange('/User-Payments')}
                    >
                        <FaCreditCard size={24} />
                        <span>Users Payments</span>
                    </div>

                    <div
                        className={`reminders ${currentPath === '/' ? 'selected' : ''
                            }`}
                        onClick={() => handleChange('/reminders-alerts')}
                    >
                        <FaBell size={24} />
                        <span>Send Reminders</span>
                    </div>

                    <div
                        className={`reports ${currentPath === '/reports' ? 'selected' : ''
                            }`}
                        onClick={() => handleChange('/reports')}
                    >
                        <FaChartBar size={24} />
                        <span>Reports</span>
                    </div>

                    <div
                        className={`settings ${currentPath === '/settings' ? 'selected' : ''
                            }`}
                        onClick={() => handleChange('/Setting')}
                    >
                        <FaCog size={24} />
                        <span>Settings</span>
                    </div>

                    <div className='logout' onClick={handleLogout}>
                        <IoLogOut size={24} />
                        <span>LogOut</span>
                    </div>

                </div>
            </div>
        </Wrapper>
    )
}

export default Menu
