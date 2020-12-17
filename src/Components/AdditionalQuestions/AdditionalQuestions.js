import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import config from '../../config.json';

function AdditionalQuestions(props) {
    const member = props.member;
    const [editError, setShowResults] = React.useState(false);
    const alert = useAlert();

    // spinner for loading
    let [loading, displaySpinner] = React.useState(false);

    const [questions, updateQuestions] = React.useState([]);

    useEffect(() => {
        getCustomerQuestions()
    }, [])

    const getCustomerQuestions = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "App-Id": config.core.app_id,
                "App-Key": config.core.app_key
            },
        };
        fetch(`${config.apiServer.api_url}/api/v5/${member.company_id}/client_details`, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                updateQuestions(data.questions)
            })
            .catch(error => {
                displaySpinner(false);
                error.message !== "401" ? setShowResults(true) : alert.show('Something went wrong. Please try again');
            });
    }


    let formQuestions = questions?.map((item, i) =>
        <div key={i}>
            {item.detail_type === "heading" &&
                <div className="form-group mt-5">
                    <h6 className="required">
                        {item.name}
                    </h6>
                    <hr />
                </div>
            }
            {item.detail_type === "text_field" &&
                <div className="form-group">
                    <label className="required">{item.name}</label>
                    <input name={item.name} type="text" className="form-control" defaultValue={member.q[item.id] ? member.q[item.id].answer : null} />
                </div>
            }
            {item.detail_type === "check" &&
                <div className="form-group">
                    <label className="required">
                        <input className="mr-3" name={item.name} type="checkbox" defaultChecked={member.q[item.id] ? member.q[item.id].answer : null} />
                        {item.name}
                    </label>
                </div>
            }
        </div>
    );

    return (
        <div className="bb-form">
            <form >
                {formQuestions}
            </form>
        </div>
    );
}

export default AdditionalQuestions;