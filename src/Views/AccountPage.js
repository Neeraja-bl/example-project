import React from 'react';
import { useHistory } from 'react-router-dom';
import ManageBookings from './bookingDetailsPage/bookingDetailsPage.js';
import './LoginPage/LoginPage.scss';
import Member from './MemberDetailsPage/Member.js';

export default function Accountpage(props) {
    const history = useHistory();

    const [view, updateView] = React.useState("member");

    var member = props.location.data;

    React.useEffect(() => {
        // This gets called after every render, by default (the first one, and every one after that)
        checkIfUserIsLoggedIn();

        // If you want to implement componentWillUnmount,
        // return a function from here, and React will call
        // it prior to unmounting.
        return () => console.log('unmounting...');
    }, [])

    const checkIfUserIsLoggedIn = () => {
        if (!member) {
            history.push("/login");
        }
    }

    const logout = () => {
        member = {};
        history.push("/");
    }

    return (
        <div className="root-container">
            <div className="root__main-wrapper">
                <div className="root__main-content">
                    <div className="root__main-content__side">

                        <div className="bb-header header__client">
                            <h3 className='header_title'>Welcome {member?._embedded?.members[0].name}</h3>
                        </div>

                        <div className="bb-sidebar">
                            <div className="sidebar-menu__container">
                                <div className="bb-primary-button">
                                    <button className="btn btn-primary sidebar-menu__button" onClick={e => updateView("member")}>
                                        <span className="sidebar-menu-item">Account</span>
                                    </button>
                                </div>
                                <div className="bb-primary-button">
                                    <button className="btn btn-primary sidebar-menu__button" onClick={e => updateView("bookings")}>
                                        <span className="sidebar-menu-item">Bookings</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="root__main-content__main">
                        {member &&
                            <div>
                                {view === "member" ? <Member member={member} /> : <ManageBookings member={member} />}
                            </div>
                        }

                    </div>

                </div>
                <div className="root__main-content">
                    <a name="logout" onClick={e => logout()} className="logout-link">
                        <span>Log out</span>
                    </a>
                </div>

            </div>
        </div>
    );
}