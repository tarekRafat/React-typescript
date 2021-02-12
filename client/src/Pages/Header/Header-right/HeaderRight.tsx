import React, { useState, useContext } from "react";
import LanguageIcon from "@material-ui/icons/Language";
import DehazeIcon from "@material-ui/icons/Dehaze";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { AuthContext } from "../../../Context/AuthContext";
import { SignUpModale } from "../../../Components/signup/SignUpModale";
import Login from "../../../Components/Login/Login";

const HeaderRight:React.FC =()=> {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const authContext = useContext(AuthContext);
  const { logout, token } = authContext;

  const toggle = () => setDropdownOpen(prevState => !prevState);
  return (
    <>
      <div className="header2__right d-none d-md-flex">
        <Link to="/become_host">
          <p className="header_host_text">Become a Host</p>
        </Link>
        <div className="header2__right__currency">
          <LanguageIcon />
        </div>
        <div className="header2__right__icons">
          <div className="header2__right__profileIcons" onClick={toggle}>
            <DehazeIcon />
            <AccountCircleIcon />
          </div>
          {dropdownOpen && (
            <ul className="links">
              {!token && (
                <li
                  role="button"
                  className="py-1"
                  onClick={() => setLoginModal(true)}
                >
                  Login
                </li>
              )}
              <Login show={loginModal}  onHide ={()=>setLoginModal(false)}/>
              {!token && (
                <li
                  role="button"
                  className="py-1"
                  onClick={() => setSignupModal(true)}
                >
                  Signup
                </li>
              )}
              <SignUpModale
              show={signupModal} onHide={()=>setSignupModal(false)}
              />

              {token && (
                <Link className="py-1" to="/edit_profile/edit">
                  <li>Sitings</li>
                </Link>
              )}
              {token && (
                <li className="py-1" onClick={logout} role="button">
                  {" "}
                  Log out
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default HeaderRight;
