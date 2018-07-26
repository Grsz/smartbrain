import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                    <img alt='Logo' src="https://png.icons8.com/ios/1600/facial-recognition-scan.png"/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;