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
    max-height: calc(100vh - 220px);
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  overflow: hidden; /* ✅ keep here */
}
.modal-scroll {
  overflow-y: auto;
  flex-grow: 1; /* ✅ allows scrollable content to take up available space */
  padding-right: 5px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
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
    background: #4977f6ff);
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

.newsavebtn button,
.newclosebtn button {
  position: static;
  margin: 0 auto;
  margin-left: 1px;
  font-size: 16px;
  background-color: #28a745; /* green for Save */
  color: white;
  border: none;
  border-radius: 6px;
  height: 45px;
  padding: 8px 16px;
  cursor: pointer;
  width: 150px;
  transition: background-color 0.3s ease-in-out, transform 0.2s;
}

.newclosebtn button {
  background-color: #ff4d4d; /* red for Close */
}


.edit-btn {
  display: inline-flex;
  align-items: center; 
  gap: 6px;
  
  background-color: #4977f6ff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.edit-btn:hover {
  background-color: #e2e6ea;
  border-color: #999;
  transform: scale(1.03);
}

.edit-btn:active {
  transform: scale(0.98);
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

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: 15px auto;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}


  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default Wrapper;