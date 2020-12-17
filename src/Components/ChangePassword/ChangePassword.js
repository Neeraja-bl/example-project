import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { BBService, BBModel } from 'bookingbug-core-js';

function ChangePassword(props) {

    const member = props.member;

    const alert = useAlert();

    // spinner for loading
    let [loading, displaySpinner] = React.useState(false);

    const { register, handleSubmit, errors } = useForm();

    const [form, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: ""
    });

    // method to assign the input values
    const handlePasswordFormChange = event => {
        event.preventDefault();
        // use spread operator
        setPasswordForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const onSubmit = (async evt => {
        alert.removeAll();
        displaySpinner(true);

        const res = await BBService.login.updatePassword(member, form);
        console.log(res);
        /* //   POST method to Update password
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'App-Id': "f6b16c23",
                'App-Key': "f0bc4f65f4fbfe7b4b3b7264b655f5eb",
                'auth-token': props.member?.auth_token
            },
            //  content for the PUT method  in JSON format
            body: JSON.stringify(form)
        }
        fetch(`https://southderbyshire-staging.council.jrni.com/api/v1/login/37003/update_password/${member?.id}`, postMethod)
            .then(response => {
                response.json()
                if (response.status === 201) {
                    alert.show(`Your password has been updated`)
                }
                else { alert.show('Something went wrong, Please try again') }
            })
            .then(data => console.log(data))
            .catch(err => {
                console.log(err.status)
                // err ==='401'||'400' ? setShowResults(true) : alert.show(err);
            }) */
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="required">Current password</label>
                <input id="currentPassword" name="current_password" type="password" className="form-control" onChange={handlePasswordFormChange} ref={register({ required: true })} />
                <div className="mt-2">
                    {errors.current_password && <span className="error">This field is required</span>}
                </div>
            </div>
            <div className="form-group"><label className="required">New password</label>
                <input id="newPassword" name="new_password" type="password" className="form-control" onChange={handlePasswordFormChange} ref={register({ required: true })} />
                <div className="mt-2">
                    {errors.new_password && <span className="error">This field is required</span>}
                </div>
            </div>
            <div className="form-group"><label className="required">Confirm new password</label>
                <input id="confirmPassword" name="confirm_new_password" type="password" className="form-control" onChange={handlePasswordFormChange} ref={register({ required: true })} />
                <div className="mt-2">
                    {errors.confirm_new_password && <span className="error">This field is required</span>}
                </div>
            </div>
            <div className="member-contact__button-box"><div className="bb-primary-button">
                <button className="btn btn-primary" type="submit">Save changes</button>
            </div>
            </div>
        </form>
    )
}
export default ChangePassword