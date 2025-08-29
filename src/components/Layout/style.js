import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
font-family: 'Inter', sans-serif;


  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }


  .heading {
    display: flex;
    flex: 1;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
    min-height: 0;
  }

  .menu {
    width: 210px;
    flex-shrink: 0;
     background: #4977f6ff;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s ease;
  }

  .menu h1 {
    font-size: 25px;
    padding: 20px;
    width: 100%;
    text-align: center;
  }

  .menu .icon {
    font-size: 24px;
    margin: 20px 0;
    cursor: pointer;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .header {
    flex-shrink: 0;
    width: 100%;
  }

  .outlet {
    flex-grow: 1;
    min-height: 0;
    overflow-y : hidden;
  }

  .footer {
    flex-shrink: 0;
    // padding: 10px;
    background: #4977f6ff;
    text-align: center;
  }

  /* Responsive layout */
  @media (max-width: 768px) {
    .menu {
      width: 150px; /* Show only icons */
    }


    .menu h1 {
      display: none; /* Hide text heading */
    }

    .main-content {
      width: 100%;
    }

    .outlet {
      padding: 10px;
    }
  }
//     * {
//   box-sizing: border-box;
// }

`;

export default Wrapper;
