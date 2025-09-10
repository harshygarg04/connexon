import styled from "styled-components";

const Wrapper = styled.section`
  cursor: default;

.users {
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap; /* ✅ allows wrapping */
  gap: 15px;
}


  .users > h1 {
    font-size: 30px;
    flex-shrink: 0;
    margin: 0;
    min-width: 150px;
  }
    

.search-container {
  flex-grow: 1;
  width: 100%;
  max-width: 350px;
  display: flex;
  justify-content: center;
  position: relative;
  margin: 0 auto;
}


 .search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.3s ease-in-out;
  }
    

.search-input {
  width: 100%;
  max-width: 450px;
  min-width: 0;
  padding: 12px 45px 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  background: #f9f9f9;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

  .search-input:focus {
    border-color: #007bff;
    background: white;
    box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3); 
  }

  .search-icon:hover {
    color: #007bff;
  }


  .table-container {
    max-height: 515px;
    overflow-y: auto;
    box-sizing: border-box;
    table-layout: fixed;
    position: relative;
    margin-left: 10px;
    margin-right: 10px;
  }


  .button-placeholder {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-shrink: 0;
    min-width: 150px;
    max-width: 100%;
    flex-wrap: nowrap;
  }

  .bulk-reset-btn,
  .bulk-delete-btn,
  .add-btn {
    padding: 8px 15px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
    flex: 1 1 auto;
    min-width: 70px;
    //max-width: 100px;
  }

  .bulk-reset-btn {
    background: #28a745;
    color: #fff;
    border: none;
  }

  .bulk-delete-btn {
    background-color: rgb(244, 67, 54);
    color: #fff;
    border: none;
  }

  .add-btn {
    background-color: #4977f6ff;
    color: black;
    font-weight: bold;
    border: none;
  }

   .name-wrap {
  max-width: 220px;
  white-space: normal;
  word-break: break-word;
  padding: 8px;
  text-align: left;   /* ✅ Left align the content inside the td */
  vertical-align: middle; /* Optional for vertical alignment */
}

.name-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* ✅ Max 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; 
  text-align: left;   /* ✅ Left align the text inside the div */
}

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
    overflow-y: auto;
    
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 418px;
    max-height: 90vh;
    max-width: 600px;
    
    min-height: 250px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;      /* enable vertical scroll */
  -webkit-overflow-scrolling: touch; /* smooth scrolling on mobile */
  }

  input {
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 2px;
    font-size: 16px;
  }

  .submit-btn {
    background: #007bff;
    color: white;
    width: 95%;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
  }

  .submit-btn:hover {
    background: #0056b3;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    //table-layout: fixed;
  }

  thead {
    position: sticky;
    top: -1px;
    background: #4977f6ff;
    color: white;
    z-index: 1;
    table-layout: fixed;
  }

  table th,
  table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  table th {
    background: #4977f6ff;
    color: black;
  }

  table td {
    background: #fff;
  }

  
  .table-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  padding: 10px 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

  .edit-btn {
    background: white;
    color: black;
    font-size: 20px;
    border: none;
    border-radius: 5px;
    padding: 8px 5px 0;
    transition: background 0.3s ease-in-out;
    margin-right: 5px;
  }

  .delete-btn {
    background: white;
    font-size: 20px;
    color: rgb(244, 67, 54);
    border: none;
    padding: 8px 5px 0;
    margin-right: 5px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ff4d4d;
    transition: 0.4s;
    border-radius: 34px;
  }

  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #4caf50;
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }


.newsavebtn {
    button {
      position: static;
      top: 12px;
      margin-left: -200px;
      font-size: 16px;
      background-color: rgb(76, 175, 80);
      color: white;
      border: none;
      border-radius: 6px;
      height: 45px;
      padding: 8px 16px;
      cursor: pointer;
      width: 150px;
      transition: background-color 0.3s ease-in-out, transform 0.2s;
    }

    .newsavebtn:hover {
      background-color: rgb(56, 142, 60);
      transform: scale(1.05);
    }

    .newsavebtn:active {
      transform: scale(0.95);
    }
  }

  .newclosebtn {
    button {
      position: absolute;
      margin-top: -60px;
      margin-right: 30px;
      margin-left: 30px;
      font-size: 16px;
      background-color: #ff4d4d;
      color: white;
      border: none;
      border-radius: 6px;
      height: 45px;
      padding: 8px 16px;
      cursor: pointer;
      width: 150px;
      transition: background-color 0.3s ease-in-out, transform 0.2s;
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 15px;
    background: none;
    color: #333;
    font-size: 40px;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
  }

  .close-btn:hover {
    color: #dc3545;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Common modal styles remain */
.modal-content {
  position: relative;
  max-width: 400px;
  width: 100%;
  overflow-x: hidden; /* stops horizontal scroll */
}


/* View Modal (User Details) */
.view-modal {
  //background: #f9fafb; /* light gray */
  border: 2px solid #007bff; /* highlight border */
  max-width: 550px;
  margin: auto;
  text-align: left;
}

.view-modal .view-title {
  font-size: 20px;
  color: #007bff;
  margin-bottom: 10px;
  text-align: center;
}

.view-modal p {
  font-size: 16px;
  margin: 4px 0;
  padding: 8px;
  background: #fff;
  border-radius: 5px;
  //border: 1px solid #eee;
   word-wrap: break-word;   /* ensures long text wraps */
  word-break: break-word;  /* fallback for very long words like no-spaces */
  white-space: normal;     /* allow wrapping */
}
.view-modal p .field-value {
  display: inline-block;
  max-width: 400px;          /* adjust according to modal width */
  white-space: normal;
  word-break: break-word;
  vertical-align: top;
}
.view-modal .newclosebtn button {
  background: #007bff;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.view-modal .newclosebtn button:hover {
  background: #0056b3;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;   /* adjust color */
}

.close-icon:hover {
  color: #d00;  /* red on hover */
}
.view-btn {
  //display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px; /* adjust for spacing */
  border: none;
  background: transparent;
  cursor: pointer;
}

// .phone-grid {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr); /* 3 columns */
//   grid-auto-rows: auto;                  /* auto height rows */
//   gap: 4px;                              /* spacing between cells */
//   margin-top: 4px;
// }

// .phone-item {
//   background: #f5f5f5;
//   padding: 6px;
//   border-radius: 5px;
//   text-align: center;
//   font-size: 14px;
//   word-break: break-word;
// }
.phone-row {
  display: flex;           /* keep label + grid on same line */
  //align-items: center;     /* vertically align */
  gap: 6px;                /* space between label and grid */
  margin: 4px 0;
}

.phone-grid {
  display: grid;
  grid-template-columns: repeat(3, auto); /* up to 3 per row */
  gap: 8px;                              /* tighter spacing */
}

.phone-item {
  background: #f5f5f5;
  padding: 8px 8px;       /* smaller box */
  border-radius: 3px;
  font-size: 14px;        /* reduced font size */
  text-align: center;
  white-space: nowrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 105%;
  //margin: px auto;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

`;

export default Wrapper;