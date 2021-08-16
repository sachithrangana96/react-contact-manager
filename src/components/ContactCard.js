import React from "react";
import { Link } from "react-router-dom";
import user from "../images/user.png";

const ContactCard = (props) => {
  const { id, name, email } = props.contact;
  return (
    <div className="item" style={{marginTop:"10px"}}>
      <img className="ui avatar image" src={user} alt="user" />
      <div className="content">
        <div className="header">{name}</div>
        <div>{email}</div>
      </div>

      <i
        className="trash alternate outline icon"
        style={{ color: "red", marginTop: "7px" }}
        onClick={() => props.clickHander(id)}
      ></i>

      <Link to={{pathname:`/edit/${id}`,state:{contact:props.contact}}}>
          <i
            className="edit alternate outline icon"
            style={{ color: "blue", marginTop: "7px" }}
           
          ></i>
      </Link>
      
    </div>
  );
};

export default ContactCard;
