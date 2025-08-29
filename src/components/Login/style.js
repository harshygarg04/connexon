import styled from "styled-components";

const Wrapper = styled.section`
  cursor: default;

  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f6f9;
    font-family: "Poppins", sans-serif;
  }

  .login-form {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 320px;
  }

  .login-form h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .form-group input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .login-btn {
    width: 50%;
    padding: 10px;
    background: #4cafef;
    border: none;
    color: white;
     display: block;     /* make it a block element */
     margin: 0 auto;     /* center horizontally */
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
  }

  .login-btn:hover {
    background: #2196f3;
  }

  .error {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
    text-align: center;
  }
`;

export default Wrapper;
