import React, { useState, useContext } from "react";
import { Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "../Login/login.css";
import { FaFacebookSquare, FaApple } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FcGoogle, FcInvite } from "react-icons/fc";
import GoogleLogin from "react-google-login";
import { AuthContext } from "../../Context/AuthContext";
import { SignUpModale } from "../signup/SignUpModale";



export interface Event{
  target:HTMLInputElement,
}
interface LoginProps{
  show:boolean,
  onHide:()=>void,
}
const Login:React.FC<LoginProps>= (props) => {
  //bootstrap modale for signup
  // const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);
  const { login } = authContext;
  const [user, setUser] = useState({});

  //changeHandler
  const handleChange= (e:Event) => {
    const { name, value } = e?.target ;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const history = useHistory();

  const handleSubmit = () => {
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, user)
      .then(res => {
        const user = res.data;
        const { token, userId, isHost } = user;
        login(userId, token, isHost);
        setLoading(false);
        history.push("/");
        setError(null);
      })
      .catch(err => {
        setError(err.response.data.message);
        setLoading(false);
      });
  };

  const responseGoogleHandler = (response:any) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, {
        tokenId: response.tokenId
      })
      .then(res => {
        // console.log(res.data);
        const user = res.data;
        const { token, userId, isHost } = user;

        login(userId, token, isHost);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        // console.log(err);
        setLoading(false);
        setError(err.response.data.message);
      });
  };
  const errorGoogleHandler = (error:string) => {console.warn(error)};
  return (
    <div className="Login-card ">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {" "}
        <Modal.Body className="text-center">
          <div className="header row login_modal_header">
            <span className=""> log in</span>
            {/* <i className="fas fa-times-circle" ></i> */}
            <ImCross onClick={props.onHide} className="imcross-icon"/>
          </div>
          <hr />
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>{error}</Alert.Heading>
            </Alert>
          )}
          <div className="region text-center">
            <div className="username-input">
              <input
                name="email"
                className="phoneNumber"
                placeholder="Email"
                type="email"
                onChange={handleChange}
              />
            </div>
            <input
              name="password"
              className="phoneNumber"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            />
          </div>

          <p>
            We’ll call or text you to confirm your number. Standard message and
            data rates apply.
          </p>
          {loading ? (
            <React.Fragment>
              <div className="text-center py-2">
                <Spinner animation="border" variant="danger" />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input
                className="continue agree-btn continue-btn"
                type="submit"
                value="Continue"
                onClick={handleSubmit}
              />
            </React.Fragment>
          )}
          <div>
            <div
              className="row"
              style={{ marginLeft: "20px", marginTop: "30px" }}
            >
              <div className="col-5" style={{ padding: 0 }}>
                <hr />
              </div>
              <div
                className="col-1"
                style={{ padding: 0, textAlign: "center" }}
              >
                or
              </div>
              <div className="col-5" style={{ padding: 0 }}>
                <hr />
              </div>
            </div>
          </div>
          <div>
            <div className="social-login__btn">
              <div className="email-container">
                <div className="email-icon-container">
                  <FcInvite style={{ fontSize: "1.5rem" }} />
                </div>
                <div className="email-text-container">Continue With Email</div>
              </div>
            </div>

            <div className="social-login__btn">
              <div className="facebook-container">
                <div className="facebook-icon-container">
                  <FaFacebookSquare
                    style={{
                      fontSize: "1.5rem",
                      color: "#1873eb",
                    }}
                  />
                </div>
                <div className="facebook-text-container">
                  Continue With Facebook
                </div>
              </div>
            </div>

            <GoogleLogin
              clientId="536259651071-lk17flcc7dm0oohv9tqdrm4kidp5tcrc.apps.googleusercontent.com"
              render={renderProps => (
                <div
                  onClick={renderProps.onClick}
                  className="social-login__btn "
                >
                  <div className="google-container">
                    <div className="google-icon-container">
                      <FcGoogle style={{ fontSize: "1.5rem" }} />
                    </div>
                    <div className="google-text-container">
                      Continue With Google
                    </div>
                  </div>
                </div>
              )}
              onSuccess={responseGoogleHandler}
              onFailure={errorGoogleHandler}
              cookiePolicy={"single_host_origin"}
              style={{
                width: "100% !important",
                marginTop: "8px !important",
              }}
            />

            <div className="social-login__btn">
              <div className="apple-container">
                <div className="apple-icon-container">
                  <FaApple
                    style={{
                      fontSize: "1.5rem",
                    }}
                  />
                </div>
                <div className="apple-text-container">Continue With Apple</div>
              </div>
            </div>
          </div>
          <div className="new-account">
            <div className="row mt-2">
              <p className="ml-3">Don't have an account</p>
              <Link
               to=""
                className="ml-1 font-weight-bold"
                // onClick={() => setModal(true)}
                // onClick={() => {
                //   setModalShow(true);
                // }}
              >
                Sign up
              </Link>
              <SignUpModale show={props.show} onHide={props.onHide}/>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
