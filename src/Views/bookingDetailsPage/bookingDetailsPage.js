import { BBService, context } from 'bookingbug-core-js';
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookingList from '../../Components/bookingLists/booking';
import '../bookingDetailsPage/bookingDetailsPage.scss';
import moment from 'moment';

// props from accounts page
function ManageBookings(props) {
    context.apiUrl = "https://southderbyshire-staging.council.jrni.com";
    context.apiVersion = "v5";

    var [subCompanies, setSubCompnies] = React.useState([]);
    var [member, setMember] = React.useState(props.member?._embedded.members[0]);
    var [loading, setBookingsLoaded] = React.useState(false);

    React.useEffect(() => {
        BBService.company.query(parseInt(37000), { excludeChildCompanies: true }).then(async companies => {
            var childCompanies = await companies.$getChildren();
            setSubCompnies(childCompanies);

            // Add empty arrays on all companies to store our bookings under
            childCompanies.forEach(company => {
                company.upcoming = [];
                company.cancelled = [];
                company.past = [];
            });

            let requestOptions = {
                method: 'GET',
                headers: {
                    'App-Id': "f6b16c23",
                    'App-Key': "f0bc4f65f4fbfe7b4b3b7264b655f5eb",
                    'Auth-Token': props.member.auth_token
                }
            };

            // Get upcoming bookings
            fetch(`${context.apiUrl}/api/v5/${member.company_id}/members/${member.id}/bookings?include_cancelled=true`, requestOptions)
                .then(response => {
                    if (response.status !== 200) {
                        throw new Error(response.status);
                    }
                    return response.json();
                }).then(data => {
                    if (data._embedded.bookings.length >= 1) {
                        data._embedded.bookings.forEach(booking => {
                            const foundCompany = childCompanies.filter(company => company.id === booking.company_id);
                            if (booking.is_cancelled) {
                                foundCompany[0].cancelled.push(booking);
                            } else if (moment().isAfter(moment(booking.end_datetime))) {
                                foundCompany[0].past.push(booking);
                            } else {
                                foundCompany[0].upcoming.push(booking);
                            }
                        });
                    }
                    setBookingsLoaded(true);
                }).catch(error => {
                    console.log(error);
                });
        });
        return () => console.log('unmounting...');
    }, []);

    return (
        <div className="bb-member">
            <div className="bb-header header__page-header">
                <h3 className="header__title">Your bookings</h3>
                <p className="header__description">Manage your bookings.</p>
            </div>
            <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" >
                {subCompanies.map((company, i) => {
                    if (company.id === 37003) {
                        return (
                            <Tab eventKey={i} title={company.name} key={i}>
                                { loading && <BookingList member={member} company={company} authtoken={props.member.auth_token} />}
                            </Tab>
                        )
                    }
                }
                )}
            </Tabs>
        </div>
    )
}

export default ManageBookings




