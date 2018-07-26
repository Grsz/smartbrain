import React from 'react';

const Navigation = ({RouteChange, isSignedIn}) => {
    //elég komplikált, hogy a signout route hogyan képes változtatni bármit is. Az Appban meghatározásra került, hogy ha a route állapota signout, akkor az isSignedIn false. Itt pedig az található, hogy ha false, akkor a Sign In, és Register legyen a navigációban. Az viszont még mindig rejtély, hogy a signout route hogyan képes befolyásolni a tartalmat.
        if (isSignedIn){
            return(
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => RouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                </nav>
            )
        } else {
            return(
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => RouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                    <p onClick={() => RouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
                </nav>
            )
        }
}

export default Navigation;