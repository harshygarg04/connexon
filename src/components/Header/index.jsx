import React from 'react'
import Wrapper from './style'
import profile from '../../assets/Profile.png'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const navigate = useNavigate()

  // const handleChange = () => {
  //   navigate('/profile')
  // }

  return (
    <Wrapper>
      <div className='header'>
        <h1>Connexon Admin</h1>
        {/* <img src={profile} alt="Profile" onClick={handleChange}/> */}
      </div>
    </Wrapper>
  )
}

export default Header
