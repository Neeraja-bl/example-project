// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useAlert } from 'react-alert';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import DotLoader from "react-spinners/DotLoader";
import '../../assets/css/loading-icon.css';
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";
import Card from "../../Components/Card/Card.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import Button from "../../Components/CustomButtons/Button.js";
import GridContainer from "../../Components/Grid/GridContainer.js";
import GridItem from "../../Components/Grid/GridItem.js";
import './LoginPage.scss';
import { BBService, BBModel } from 'bookingbug-core-js';
import { createClient } from "hal-rest-client";

const useStyles = makeStyles(styles);


export default function LoginPage(props) {
  const [user, setUser] = useState('')
  const history = useHistory();
  const alert = useAlert()
  const { register, handleSubmit, errors } = useForm();
  const [loginError, setShowResults] = React.useState(false);
  const client = createClient();

  const [formData, updateFormData] = React.useState("");

  let [loading, displaySpinner] = React.useState(false);

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  var resetPassword = () => {
    if (!formData || 0 === formData.length) {
      alert.show('Please enter your email');
    } else {
      displaySpinner(true);

      const resetParams = {
        email: formData.email
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App-Id': "f6b16c23",
          'App-Key': "f0bc4f65f4fbfe7b4b3b7264b655f5eb"
        },
        body: JSON.stringify(resetParams)
      };

      fetch('https://southderbyshire-staging.council.jrni.com/api/v5/login/37003/email_password_reset', requestOptions)
        .then(response => {
          if (response.status !== 201) {
            throw new Error(response.status);
          }
          return response.json();
        })
        .then(data => {
          displaySpinner(false);
          alert.show(data.message);
        })
        .catch(error => {
          displaySpinner(false);
          console.log(error);
          alert.show('Something went wrong. Please try again');
        });
    }
  }

  var loginUser = () => {
    displaySpinner(true);
    alert.removeAll();
    const loginParams = {
      host: "https://southderbyshire-staging.council.jrni.com/",
      email: formData.email,
      password: formData.password
    }

    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': "f6b16c23",
        'App-Key': "f0bc4f65f4fbfe7b4b3b7264b655f5eb"
      },
      body: JSON.stringify(loginParams)
    };
<<<<<<< HEAD
   
 
    fetch('https://southderbyshire-staging.council.jrni.com/api/v4/login/37003/', requestOptions)
=======

    fetch('https://southderbyshire-staging.council.jrni.com/api/v5/login/37003/', requestOptions)
>>>>>>> 17ebb431f74cc737c3de09756d1d71959870f3b7
      .then(response => {
        if (response.status !== 201) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        setUser(data)
        displaySpinner(false);
        history.push({
          pathname: '/account-page',
          data: data,
        });
      })
      .catch(error => {
        displaySpinner(false);
        error.message === "401" ? setShowResults(true) : alert.show('Something went wrong. Please try again');
      });
  }


  const Results = () => (
    <div id="results" className="results">
      Incorrect email or password
    </div>
  )

  const classes = useStyles();
  const { ...rest } = props;


  return (
    <div className="container">
      <div>
        <div className="section">
          <h3 className="header_title text-center">Log in to view your account</h3>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={5}>
              <div className="sweet-loading">
                <DotLoader
                  size={150}
                  color={"#2d0054"}
                  loading={loading}
                />
              </div>
              <Card className={`${loading ? "loading" : ""}`}>
                <Form onSubmit={handleSubmit(loginUser)}>
                  <CardBody>
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup className="input">
                        <Form.Control type="text" name="email" onChange={handleChange} ref={register({ required: true })} />

                      </InputGroup>
                      {errors.email && <span className="error">Email is required</span>}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control type="password" name="password" onChange={handleChange} ref={register({ required: true })} />

                      </InputGroup>
                      {errors.password && <span className="error">Password is required</span>}
                    </Form.Group>

                    {loginError ? <Results /> : null}

                  </CardBody>

                  <CardFooter className={`card-footer ${classes.cardFooter}`}>
                    <Button type="submit" simple color="primary" size="lg" className="login-btn">
                      Login
                    </Button>

                    <Button simple color="primary" size="lg" className="reset-password" onClick={resetPassword}>
                      Forgotten password?
                    </Button>

                  </CardFooter>
                </Form>
              </Card>
            </GridItem>
          </GridContainer>

        </div>
      </div>
    </div>
  );
}
