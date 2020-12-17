import { context } from 'bookingbug-core-js';
import moment from 'moment';
import React from 'react';
import { Button, Modal } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './booking.scss';

function BookingList(props) {

    var requestOptions = {
        method: '',
        headers: {
            'App-Id': "f6b16c23",
            'App-Key': "f0bc4f65f4fbfe7b4b3b7264b655f5eb",
            'Auth-Token': props.authtoken
        }
    };

    const member = props.member;

    const [upcomingButtonName, updateUpcomingBtnName] = React.useState("View");
    const [pastButtonName, updatePastBtnName] = React.useState("View");
    const [cancelledButtonName, updateCancelledBtnName] = React.useState("View");

    const [upcoming, updateUpcomingBookings] = React.useState(props.company?.upcoming);
    const [past, pastBookings] = React.useState(props.company?.past);
    const [cancelled, cancelledBookings] = React.useState(props.company?.cancelled);
    const [bookingToCancel, SetBookingToCancel] = React.useState();
    const [loaded, setBookingsLoaded] = React.useState(false);

    const [showCancelModal, setShow] = React.useState(false);
    const [showCancelConfirmModal, setConfirmShow] = React.useState(false);

    const handleCancelModalClose = () => setShow(false);
    const handleCancelModalShow = () => setShow(true);

    const handleCancelConfirmModalClose = () => setConfirmShow(false);
    const handleCancelConfirmModalShow = () => setConfirmShow(true);

    function openCancelModal(booking) {
        SetBookingToCancel(booking);
        handleCancelModalShow();

        // Update the upcoming bookings array so that the cancelled booking is removed from the list
        let filteredArray = upcoming.filter(upcomingBooking => upcomingBooking.id !== booking.id);
        updateUpcomingBookings(filteredArray);
    }

    async function cancelBooking() {
        requestOptions.method = "DELETE";
        fetch(`${context.apiUrl}/api/v5/${member.company_id}/members/${member.id}/bookings/${bookingToCancel.id}`, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(response.status);
                }
                return response.json();
            }).then(booking => {
                if (booking.is_cancelled) {
                    // Update the cancelled array to add the cancelled booking
                    let cancelledArr = [...cancelled];
                    cancelledArr.push(booking);
                    cancelledBookings(cancelledArr);

                    // Booking was cancelled, Show confirmed modal
                    handleCancelModalClose();
                    handleCancelConfirmModalShow();
                }
            });
    }

    React.useEffect(() => {
        requestOptions.method = "GET";
        // get past bookings
        const today = moment();
        const lastYear = moment().subtract(1, 'year');

        fetch(`${context.apiUrl}/api/v5/${member.company_id}/members/${member.id}/bookings?start_date=${lastYear.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}&include_cancelled=true&page=1&per_page=999999`, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(response.status);
                }
                return response.json();
            }).then(data => {
                let past = [];
                let cancelled = [];
                if (data._embedded.bookings.length >= 1) {
                    data._embedded.bookings.forEach(booking => {
                        if (booking.is_cancelled) {
                            cancelled.push(booking)
                        } else {
                            past.push(booking);
                        }
                    });
                }
                pastBookings(past);
                setBookingsLoaded(true);
            }).catch(error => {
                console.log(error);
            });
        return () => console.log('unmounting...');
    }, []);

    return (
        <div className="bookings" >

            <Modal show={showCancelConfirmModal} onHide={handleCancelModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Cancelled</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3> The booking was sucessfully cancelled</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelConfirmModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCancelModal} onHide={handleCancelModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Booking?</Modal.Title>
                </Modal.Header>
                {bookingToCancel && <Modal.Body>
                    <h3> Are you sure you wish to cancel the following booking?</h3>
                    <p> <b>Booking id:</b> {bookingToCancel.id} <br />
                        <b>Description:</b> {bookingToCancel.full_describe} <br />
                        <b>Time & date:</b> {bookingToCancel.describe}
                    </p>
                </Modal.Body>}
                <Modal.Footer>
                    <Button variant="primary" onClick={() => cancelBooking()}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleCancelModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {loaded &&
                <Accordion>
                    <Card>
                        <div className="item__header">
                            <Accordion.Toggle className="accordion-btn" eventKey="0">
                                <div className="item__title">Upcoming bookings</div>
                            </Accordion.Toggle>
                            <Accordion.Toggle eventKey="0" className="accordion-btn bb-primary-button">
                                <button className='btn btn-primary bb-accordion_button' onClick={e => upcomingButtonName === "View" ? updateUpcomingBtnName("Close") : updateUpcomingBtnName("View")}>
                                    {upcomingButtonName}
                                </button>
                            </Accordion.Toggle>
                        </div>

                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {upcoming.length >= 1 ? upcoming.map((booking, i) =>
                                    <Card key={i}>
                                        <Card.Body>
                                            <Card.Title>{booking.full_describe}</Card.Title>
                                            <Card.Text>
                                                {booking.describe}
                                            </Card.Text>
                                            <DropdownButton id="dropdown-basic-button" title="Options">
                                                <Dropdown.Item onClick={() => openCancelModal(booking)}>Cancel</Dropdown.Item>
                                            </DropdownButton>
                                        </Card.Body>
                                    </Card>
                                ) : <h5>No upcoming bookings</h5>}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>


                    <Card>
                        <div className="item__header">
                            <Accordion.Toggle className="accordion-btn" eventKey="1">
                                <div className="item__title">Past bookings</div>
                            </Accordion.Toggle>
                            <Accordion.Toggle eventKey="1" className="accordion-btn bb-primary-button">
                                <button className='btn btn-primary bb-accordion_button' onClick={e => pastButtonName === "View" ? updatePastBtnName("Close") : updatePastBtnName("View")}>
                                    {pastButtonName}
                                </button>
                            </Accordion.Toggle>
                        </div>

                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                {past.length >= 1 ? past.map((booking, i) =>
                                    <Card key={i}>
                                        <Card.Body>
                                            <Card.Title>{booking.full_describe}</Card.Title>
                                            <Card.Text>
                                                {booking.describe}
                                            </Card.Text>
                                            <DropdownButton id="dropdown-basic-button" title="Options">
                                                <Dropdown.Item disabled href="#/action-3">Cancel</Dropdown.Item>
                                            </DropdownButton>
                                        </Card.Body>
                                    </Card>
                                ) : <h5>No past bookings</h5>}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <div className="item__header">
                            <Accordion.Toggle className="accordion-btn" eventKey="2">
                                <div className="item__title">Cancelled bookings</div>
                            </Accordion.Toggle>
                            <Accordion.Toggle eventKey="2" className="accordion-btn bb-primary-button">
                                <button className='btn btn-primary bb-accordion_button' onClick={e => cancelledButtonName === "View" ? updateCancelledBtnName("Close") : updateCancelledBtnName("View")}>
                                    {cancelledButtonName}
                                </button>
                            </Accordion.Toggle>
                        </div>

                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                {cancelled.length >= 1 ? cancelled.map((booking, i) =>
                                    <Card key={i}>
                                        <Card.Body>
                                            <Card.Title>{booking.full_describe}</Card.Title>
                                            <Card.Text>
                                                {booking.describe}
                                            </Card.Text>
                                            <DropdownButton id="dropdown-basic-button" title="Options">
                                                <Dropdown.Item disabled href="#/action-3">Cancel</Dropdown.Item>
                                            </DropdownButton>
                                        </Card.Body>
                                    </Card>
                                ) : <h5>No cancelled bookings</h5>}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>
            }
        </div>
    )
}
export default BookingList;