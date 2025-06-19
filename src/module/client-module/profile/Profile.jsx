import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Loading from "../loading/Loading";
import { fetch } from "../../../api/Fetch";
import "./profile.scss";
import ProfileNav from "../../../components/client/profileNav/ProfileNav";
import ProfileHome from "./ProfileHome";
import { Navigate, Outlet, Route, Router, Routes, useNavigate } from "react-router-dom";
import ProfileAccount from "./ProfileAccount";
import { useSelector } from "react-redux";


const Profile = () => {
  const navigate = useNavigate();
  const login = useSelector(state => state.auth.login)
  console.log(login);

  if(!login){
   return <Navigate to={"/login"}></Navigate>
  }

  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="profile_section">
      <Container style={{ width: "80%" }}>
        <div id="profile" className="py-5">
          <Row>
            <Col lg={3}>
              <ProfileNav></ProfileNav>
            </Col>
            <Col>
                <Outlet></Outlet>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Profile;
