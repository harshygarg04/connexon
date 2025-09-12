// nice stylinng

import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const checkmark = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Wrapper = styled.section`
  .reset-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    background-color: #f4f6f9;
    padding: 20px;
  }

  .reset-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 500px;
    animation: ${fadeIn} 0.5s ease-in-out;
  }

  .success-card {
    text-align: center;
    padding: 50px 40px;
  }

  .success-animation {
    margin: 0 auto 30px;
    animation: ${checkmark} 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  .success-message {
    color: #666;
    font-size: 18px;
    margin-top: 20px;
    line-height: 1.6;
  }

  .reset-heading {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-weight: 600;
  }

  .reset-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .reset-input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reset-label {
    font-size: 16px;
    color: #555;
    font-weight: 500;
  }

  .reset-input {
    width: 80%;
    padding: 14px 18px;
    border-radius: 25px;
    border: 1px solid #ddd;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .reset-input:focus {
    border-color: rgb(177, 179, 215);
    box-shadow: 0 2px 8px rgba(177, 179, 215, 0.3);
  }

  .reset-message {
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    font-weight: 500;
    margin: 10px 0;
    background-color: rgba(177, 179, 215, 0.1);
    border-left: 4px solid rgb(177, 179, 215);
  }

  .reset-button {
    background-color: rgb(177, 179, 215);
    color: white;
    padding: 14px 30px;
    border-radius: 25px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    align-self: center;
    margin-top: 10px;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 250px;
    letter-spacing: 0.5px;
  }

  .reset-button:hover {
    background-color: #9a9bc7;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(154, 155, 199, 0.4);
  }

  .reset-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(154, 155, 199, 0.4);
  }

  .reset-button-disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .password-requirements {
    font-size: 14px;
    color: #777;
    margin-top: 5px;
    padding-left: 10px;
  }

  .brand-logo {
    text-align: center;
    margin-bottom: 20px;
  }

  .brand-logo img {
    height: 60px;
    width: auto;
  }

  @media (max-width: 768px) {
    .reset-card {
      padding: 30px 20px;
    }

    .reset-heading {
      font-size: 24px;
    }
  }
`;

export default Wrapper;

