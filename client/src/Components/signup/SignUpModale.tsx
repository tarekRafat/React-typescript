import React, { useState, useContext } from "react";
import { Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import "./Signup.css";
import { Modal } from "react-bootstrap";
import { AuthContext } from "../../Context/AuthContext";
import { ImCross } from "react-icons/im";

type Inputs = {
  firstName: string;
  lastName: string;
  date: string;
  email: string;
  password: string;
};
type SignUpProps = {
  show:boolean,
  onHide:()=>void,
}

export const SignUpModale: React.FC<SignUpProps> = (props) => {
  const authContext = useContext(AuthContext);
  const { login } = authContext;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, errors } = useForm<Inputs>(
    {
      mode:"onTouched"
    }
  );
  const history = useHistory();
  const route = useRouteMatch();

  const [validDate, setValidDate] = useState(false);

  if (validDate) {
    setTimeout(() => setValidDate(false), 3000);
  }

  const onSubmitHandler = (dataForm: Inputs) => {
    let sendData;

    const pickedDate = new Date(dataForm.date).getFullYear();
    const validDate = new Date("2002-01-01").getFullYear();

    if (pickedDate > validDate) {
      return setValidDate(true);
    }

    if (route.path === "/become_host") {
      sendData = {
        ...dataForm,
        isHost: true,
      };
    } else {
      sendData = dataForm;
    }

    // const config = {
    //   header: {
    //     "Content-Type": "application/json",
    //   },
    // };

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, sendData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(res => {
        // console.log(res);
        const user = res.data;
        const { token, userId, isHost } = user;

        if (route.path === "/become_host") {
          login(userId, token, isHost);
          history.push("/host_form");
        } else {
          login(userId, token, isHost);
        }

        setLoading(false);
        setError(null);

        return res;
      })
      .catch(err => {
        setLoading(false);
        setError(err.response.data.message);
        // console.log(err.response.data.message);
      });
  };

  return (
    <div id="signupmodel">
      <Modal
	  {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ borderRadius: "2rem" }}
      >
        {" "}
        <Modal.Body style={{ borderRadius: "2rem" }}>
          <div className="signup-container">
            <div className="finish-signup">
              <h3 className="text-center">Sign Up</h3>
            <ImCross onClick={props.onHide} className="imcross-icon-signup"/>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="full-name">
                {/* FirstName */}
                <div className="name-input">
                  <input
                    type="text"
                    name="firstName"
                    id="fName"
                    placeholder="First name"
                    ref={register({
                      required: true,
                      minLength: 4,
                      maxLength: 8,
                      pattern: /^[A-Za-z]+$/i,
                    })}
                  />

                  {/* firstName Error messages  */}
                  {errors.firstName && errors.firstName.type === "required" && (
                    <p className="error">Please Enter Your First Name</p>
                  )}
                  {errors.firstName &&
                    errors.firstName.type === "minLength" && (
                      <p className="error">
                        First Name must be 4-8 characters long
                      </p>
                    )}
                  {errors.firstName &&
                    errors.firstName.type === "maxLength" && (
                      <p className="error">
                        First Name must be 4-8 characters long
                      </p>
                    )}
                  {errors.firstName && errors.firstName.type === "pattern" && (
                    <p className="error">Please Enter Invalied Name</p>
                  )}
                </div>

                {/* LastName */}
                <div className="name-input last-name">
                  <input
                    type="text"
                    name="lastName"
                    id="lName"
                    placeholder="Last name"
                    ref={register({
                      required: true,
                      minLength: 4,
                      maxLength: 8,
                      pattern: /^[A-Za-z]+$/i,
                    })}
                  />
                  {/* Error messages  */}
                  {errors.lastName && errors.lastName.type === "required" && (
                    <p className="error">Please Enter Your Last Name</p>
                  )}
                  {errors.lastName && errors.lastName.type === "minLength" && (
                    <p className="error">
                      Last Name must be 4-8 characters long
                    </p>
                  )}
                  {errors.lastName && errors.lastName.type === "maxLength" && (
                    <p className="error">
                      Last Name must be 4-8 characters long
                    </p>
                  )}
                  {errors.lastName && errors.lastName.type === "pattern" && (
                    <p className="error">Please Enter Invalied Name</p>
                  )}{" "}
                </div>
              </div>
              <span>Make sure it matches the name on your government ID.</span>
              <br />

              {/* data  */}
              <div className="input-container">
                <input
                  id="date"
                  type="date"
                  style={{ width: "100%" }}
                  ref={register({ required: true })}
                  name="date"
                />
              </div>
              {errors.date && (
                <span className="error">Birthday is required</span>
              )}
              {validDate && (
                <span className="error">Age nust be Above 18 years</span>
              )}

              <span>
                To sign up, you need to be at least 18. Your birthday won’t be
                shared with other people who use Airbnb.
              </span>
              <br />

              {/* EmailInput */}
              <div className="input-container">
                <input
                  name="email"
                  id="email"
                  placeholder="Email"
                  ref={register({
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {/*Email Error Messages  */}
                {errors.email && errors.email.type === "required" && (
                  <p className="error">Please Enter Your Email Adress</p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="error">Please Enter Invalied Email</p>
                )}
              </div>
              <span>We'll email you trip confirmations and receipts.</span>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError(null)}
                  dismissible
                >
                  <Alert.Heading>{error}</Alert.Heading>
                </Alert>
              )}
              <br />

              {/* password */}
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  id="pass"
                  placeholder="Password"
                  ref={register({ required: true })}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="error">Please Enter Your Password</p>
                )}
              </div>

              {loading ? (
                <React.Fragment>
                  <div className="text-center py-2">
                    <Spinner animation="border" variant="danger" />
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span>
                    By selecting Agree and continue below, I agree to Airbnb’s
                    <a href="#">Terms of Service</a> ,
                    <a href="#">Payments Terms of Service</a> ,{" "}
                    <a href="#">Privacy Policy</a>, and{" "}
                    <a href="#">Nondiscrimination Policy</a>.
                  </span>
                  <br />
                  <input
                    type="submit"
                    className="agree-btn"
                    value="Agree and continue"
                    name="submit-btn"
                  />
                  <span>
                    Airbnb will send you members-only deals, inspiration,
                    marketing emails, and push notifications. You can opt out of
                    receiving these at any time in your account settings or
                    directly from the marketing notification.
                  </span>
                  <br />
                  <div className="send-reminder">
                    <input type="checkbox" name="keep_contact" id="checkBox" />
                    <label htmlFor="checkBox">
                      I don’t want to receive marketing messages from Airbnb.
                    </label>
                  </div>
                </React.Fragment>
              )}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
