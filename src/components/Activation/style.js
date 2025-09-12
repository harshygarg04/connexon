import styled, { keyframes } from "styled-components";

// 🔁 Animation keyframes
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 0 20px;

  img {
    width: 150px;
    height: auto;
    margin-bottom: 20px;
    animation: ${fadeInUp} 1s ease-out;
  }

  h1 {
    font-size: 24px;
    color: #333;
    max-width: 600px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    animation: ${fadeInUp} 1.2s ease-out;
    animation-delay: 0.3s;
    animation-fill-mode: both;
  }

  @media (max-width: 600px) {
    img {
      width: 100px;
    }

    h1 {
      font-size: 18px;
      max-width: 90%;
    }
  }
`;

export default Wrapper