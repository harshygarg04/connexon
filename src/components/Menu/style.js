import styled from "styled-components";

const Wrapper = styled.section`
.menu-bar{
    background :#4977f6ff;
    display : flex;
    flex-direction : column;
    
}
.heading{
    h1{
        font-size : 30px;
        padding : 25px;
    }
}
.content{
    display : flex;
    flex-direction : column;
    flex-grow: 1;
    div{
        display : flex;
        align-items : center;
        padding : 10px 20px;
    }
    span{
        margin-left : 10px;
    }
}

.content div {
    position: relative;
    padding: 10px 20px;
    border: 2px solid transparent; /* Default transparent border */
    border-radius: 8px;
    transition: transform 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
}

.content div:hover {
    transform: translateY(-3px); /* Pop-up effect on hover */
    border-color: rgba(0, 0, 0, 0.2); /* Transparent border effect */
}

.content div.selected {
    border-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.content .logout{
    border : 1.5px solid #4977f6ff;
    margin : 4px;
    border-radius : 5px;
    color :rgb(211, 16, 16);
}

`
export default Wrapper