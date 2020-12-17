import React from 'react'
import './Header.css';
import { Link } from 'react-router-dom';

// import Logo from '../../assets/img/bookinglab.png';

function Header() {
    return (
        <div className="Header">
            <Link to="./" className="brand-logo">
                <img className="img" alt="Logo" src="https://www.southderbyshire.gov.uk/graphics/South-derbyshire-district-council-logo-words.png" />
            </Link>
        </div>
    )
}

export default Header