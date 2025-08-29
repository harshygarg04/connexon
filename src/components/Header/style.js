import styled from "styled-components";

const Wrapper = styled.header`
  background: #4977f6ff;
  width: calc(100%);
  min-height: 85px;
   /* reduce height here */

  display: flex;
  align-items: center;
  justify-content: space-between;

  .header {
    h1 {
      font-size: 30px;   /* reduce font size */
      padding: 0 10px;   /* less padding → less height */
    }

    img {
      width: 24px;
      height: 24px;
      padding-right: 15px;
      filter: invert(1);
    }
  }
`



export default Wrapper