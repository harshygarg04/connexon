import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import activate from "../../assets/activate.png";
import Wrapper from './style';
import { FaSpinner } from "react-icons/fa"; 

const Activation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.post('/user-profile/activate', {
          token: token,
        });

        if (response.status === 200) {
          setMessage("Your account has been activated! Please login to continue.");
        } else {
          setMessage("Activation failed. Please check your activation link.");
        }
      } catch (error) {
        console.error("Activation error:", error);
        setMessage("Invalid or expired activation token.");
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [token]);

  return (
    <Wrapper>
      <img src={activate} alt="activate" />
      {loading ? (
        <div style={{ marginTop: '20px', fontSize: '24px', color: '#555' }}>
          <FaSpinner className="spinner" /> Activating your account...
        </div>
      ) : (
        <h1>{message}</h1>
      )}
    </Wrapper>
  );
};

export default Activation;