import React from "react"
import { useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"
import Menu from "../Menu"
import Header from '../Header'
import Footer from '../Footer'
import Wrapper from "./style"

const Layout = () => {

    const location = useLocation()
    const hiddenRoutes = ["/profile"]
    return (
        <Wrapper>
            <div className="home">
                <div className="heading">
                    {/* {!hiddenRoutes.includes(location.pathname) && ( */}
                    <div className="menu">
                        <Menu />
                    </div>

                    {/* )} */}
                    <div className="main-content">
                        
                        {/* {!hiddenRoutes.includes(location.pathname) && */}
                        <div className="header">
                            <Header />
                        </div>
                        {/* } */}
                        <div className="outlet">
                            <Outlet />
                        </div>
                    </div>
                </div>
                
                <div className="footer">
                    <Footer/>
                </div>
            </div>
        </Wrapper>
    )
}

export default Layout
