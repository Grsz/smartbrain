import React from 'react';

class Signin extends React.Component{
    //a props azért kell, mert használni akarjuk majd a RouteChange, loadUser propsot
    constructor(props){
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    //az onEmailChange, és onPasswordChange a sign in form beviteli mezőjeit az onChange jellemzővel olvassa, és a Signin.state.signInEmail, és signin.state.signInPassword állapotokat állítja be a beviteli mező értékei alapján
    }
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }
    //ha a Sign In gomb megnyomásra kerül (onClick jellemzővel), hívja az onSubmitSignIn funkciót. A fetch-csel megadjuk az endpointot, ahol POST módszert alkalmazva posztolunk a szerver routjának. A headerbe meghatározzuk a tartalom típusát, a body-t pedig json formátumba konvertáljuk. A bodyba elküldjük a szervernek az aktuális állapotok értékeként a req.body.email, és passwordot. Amennyiben a szerver módszere 200-as státuszt küld, a válaszként megkapjuk (amennyiben minden egyezik) a kért felhasználó objectet. Ezt a szerver jsonba küldi nekünk, ezért átkonvertáljuk. Aztán ha a kapott usernek van id-je, akkor két dolog történik. A SIgnin jellemzőiként küldjük a loadUser-ben az usert, és a route-t a homera változtatjuk (azaz beengedjük az appba)
    onSubmitSignIn = () => {
        fetch('http://localhost:3001/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id){
                    this.props.loadUser(user)
                    this.props.RouteChange('home')
                }
            })

    }

    render (){
        return (
            <article className="br3 ba dark-gray b--black-10 mv6 shadow-5 w-100 w-50-m w-25-l mw5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
                    </div>
                    </fieldset>
                    <div className="">
                    <input 
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Sign in"
                        //mivel ha a fn-t hívnánk a végén ()-vel, rögtön aktiválódna, egy újabb funkcióba tesszük, ami csak akkor aktiválódik, ha megtörténik az onClick event
                        onClick={this.onSubmitSignIn}
                    />
                    </div>
                    <div className="lh-copy mt3">
                    <p onClick={() => this.props.RouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
            </article>

        );
    }
}

export default Signin;