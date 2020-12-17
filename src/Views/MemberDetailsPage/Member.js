import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import DotLoader from "react-spinners/DotLoader";
import AdditionalQuestions from '../../Components/AdditionalQuestions/AdditionalQuestions.js';
import config from '../../config.json';
import '../MemberDetailsPage/Member.scss';
import { useForm } from 'react-hook-form';
import ChangePassword from '../../Components/ChangePassword/ChangePassword.js';

// props from accounts page
function Member(props) {
    const member = props.member?._embedded.members[0];


    const alert = useAlert();

    // spinner for loading
    let [loading, displaySpinner] = React.useState(false);

    // Button toggle actions
    const [contactInformationTitle, setInformationTitle] = React.useState('Edit');
    const [additionalInformationTitle, setAdditionalTitle] = React.useState('Edit');
    const [securityTitle, setSecurityTitle] = React.useState('Edit');

    const { register, handleSubmit, errors } = useForm();

    // set state for customer questions
    const [customerQuestions, setQuestions] = useState(member?.answers);

    // remove duplicates and create a new array
    const uniqueQuestions = []
    const unique = customerQuestions?.reduce((unique, o) => {
        if (!unique.some(obj => obj.question_id === o.question_id && obj.name === o.name)) {
            uniqueQuestions.push(o);
        }
        return uniqueQuestions;
    }, []);

    // map method for the items in the array 
    let questions = uniqueQuestions?.map((item) =>
        <li key={item.question_id}><h6>{item.name}</h6> <p>{item.answer}</p> </li>
    );


    // react hook to set state from the form
    const [form, setForm] = useState({
        consent: 'true',
        first_name: member?.first_name,
        last_name: member?.last_name,
        email: member?.email,
        mobile: member?.mobile,
        address1: member?.address1,
        address2: member?.address2,
        address3: member?.address3,
        address4: member?.address4,
        postcode: member?.postcode,

    });

    // method to assign the input values
    const handleChange = event => {
        event.preventDefault();
        // use spread operator
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    // on Submit the details are updated 
    const onSubmit = (evt) => {
        alert.removeAll();
        displaySpinner(true);
        // PUT method to edit member details
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                "App-Id": config.core.app_id,
                "App-Key": config.core.app_key,
                "Auth-Token": props.member.auth_token
            },

            // content for the PUT method  in JSON format
            body: JSON.stringify(form)
        }
        fetch(`${config.apiServer.api_url}/api/v1/37003/members/${member?.id}`, putMethod)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                displaySpinner(false);
                alert.info('Details successfully updated')
            }).catch(err => {
                displaySpinner(false);
                alert.error('Something went wrong .Please try again');
            })
    }

    return (
        <div className="bb-member">
            <div className="bb-header header__page-header">
                <h3 className="header__title">Your account</h3>
                <p className="header__description">Manage your account, including contact information and password.</p>
            </div>
            <div className="sweet-loading">
                <DotLoader
                    size={150}
                    color={"#007933"}
                    loading={loading}
                />
            </div>
            <div>
                <Accordion>
                    <Card >
                        <div className="item__header">
                            <Accordion.Toggle eventKey="0" className="accordion-btn">
                                <div className="item__title">Contact Information</div>
                            </Accordion.Toggle>
                            <Accordion.Toggle eventKey="4" className="accordion-btn bb-primary-button">
                                <button className='btn btn-primary bb-accordion_button' onClick={() => contactInformationTitle === "Edit" ? setInformationTitle("Close") : setInformationTitle("Edit")}>
                                    {contactInformationTitle}
                                </button>
                            </Accordion.Toggle>
                        </div>

                        <Accordion.Collapse eventKey="0">
                            <Card.Body className="card_body" >
                                <div className="bb-card">
                                    <ul>
                                        <li><h6>Name</h6><p>{member?.name}</p></li>
                                        <li><h6>Email</h6><p>{member?.email}</p></li>
                                        <li><h6>Address</h6><p>{member?.address1}</p></li><li>
                                            <h6>Country</h6><p>{member?.postcode}</p></li>
                                    </ul>
                                </div></Card.Body>
                        </Accordion.Collapse>

                        {/* Form for editing member details */}
                        <Accordion.Collapse eventKey="4">
                            <Card.Body className="card_body" >
                                <div className="bb-card">
                                    <div className="bb-form">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="form-group">
                                                <label className="required">First name</label>
                                                <input id="first_name" name="first_name" type="text" className="form-control" defaultValue={member?.first_name} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.first_name && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="required">Last name</label>
                                                <input id="last_name" name="last_name" type="text" className="form-control" defaultValue={member?.last_name} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.last_name && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="required">Email</label>
                                                <input id="email" name="email" type="email" className="form-control" readOnly defaultValue={member?.email} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.email && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="">Mobile</label>
                                                <input id="mobile" name="mobile" type="number" className="form-control" defaultValue={member?.mobile} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.mobile && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="">Address1</label>
                                                <input id="address1" name="address1" type="text" className="form-control" defaultValue={member?.address1} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.address1 && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="">Address2</label>
                                                <input id="address2" name="address2" type="text" className="form-control" defaultValue={member?.address2} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.address2 && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="">Address3</label>
                                                <input id="address3" name="address3" type="text" className="form-control" defaultValue={member?.address3} onChange={handleChange} />
                                            </div>

                                            <div className="form-group">
                                                <label className="">Town</label>
                                                <input id="address4" name="address4" type="text" className="form-control" defaultValue={member?.address4} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.address4 && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="">Postcode</label>
                                                <input id="postcode" name="postcode" type="text" className="form-control" defaultValue={member?.postcode} onChange={handleChange} ref={register({ required: true })} />
                                                <div className="mt-2">
                                                    {errors.postcode && <span className="error">This field is required</span>}
                                                </div>
                                            </div>

                                            <div className="member-contact__button-box"><div className="bb-primary-button">
                                                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Save changes</button>
                                                {/* <button className="btn btn-secondary" onClick={handleCancel}> Cancel </button> */}
                                            </div>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <Accordion>
                    <Card>
                        <div className="item__header">
                            <Accordion.Toggle className="accordion-btn" eventKey="1">
                                <div className="item__title">Additional Information</div>
                            </Accordion.Toggle>
                            <Accordion.Toggle className="accordion-btn bb-primary-button" eventKey="5">
                                <button className='btn btn-primary bb-accordion_button' onClick={() => additionalInformationTitle === "Edit" ? setAdditionalTitle("Close") : setAdditionalTitle("Edit")}>
                                    {additionalInformationTitle}
                                </button>
                            </Accordion.Toggle>
                        </div>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <ul>{questions}</ul>
                            </Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Collapse eventKey="5">
                            <Card.Body className="card_body" >
                                <div className="bb-card">
                                    <AdditionalQuestions member={member} />
                                    {/*   <div className="member-contact__button-box">
                                        <div className="bb-primary-button">
                                            <button className="btn btn-primary" type="submit">Save changes</button>
                                        </div>
                                    </div> */}
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <Accordion>
                    <Card>
                        <div className="item__header">
                            <Accordion.Toggle className="accordion-btn" eventKey="2">
                                <div className="item__title"> Security Information</div> </Accordion.Toggle>
                            <Accordion.Toggle className="accordion-btn bb-primary-button" eventKey="6">
                                <button className='btn btn-primary bb-accordion_button' onClick={() => securityTitle === "Edit" ? setSecurityTitle("Close") : setSecurityTitle("Edit")}>
                                    {securityTitle}
                                </button>
                            </Accordion.Toggle>
                        </div>

                        <Accordion.Collapse eventKey="2">
                            <Card.Body>Security Information</Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Collapse eventKey="6">
                            <Card.Body className="card_body" >
                                <div className="bb-card">
                                    <div className="bb-form">
                                        <ChangePassword member={member}/>
                                    </div>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>

        </div>
    )
}
export default Member