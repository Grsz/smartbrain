import React from 'react';

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }
//a register is smart object, ugyanis változó értékeket tartalmaz. Ilyenek a regisztrációhoz szükséges email, jelszó, és név. A beviteli mezők onChange jellemzői hívják az onKívántelemChange funkciót, és a Register.state.kívántelem-et a beviteli mezők értékére állítják.
    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }
    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    //ha a register gombra kattint a felhasználó (onClick), akkor az hívja az onSubmitSignIn funkciót. A register endpointnak POST-olunk, tehát infót küldünk, ahol a bodyban küldjük a Register.state alapján az értékeket. A Signin elemhez hasonlóan konvertáljuk jsonba a küldendő értékeket, ahol a szerver a jelszót crypteli, a többi adatot pedig tárolja az adatbázisba.(push), majd visszaküldi az új user objectet. Mi ezt úgy kezeljük, hogy a választ objectre konvertáljuk jsonból, és ha visszaküldte a szerver az usert (azaz minden rendben történt), akkor a Register jellemzőiként küldjük az Appnak az usert, és a routet állítjuk homera, azaz beléphet az appba.
    onSubmitSignIn = () => {
        fetch('http://localhost:3001/register ', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user){
                    this.props.loadUser(user)
                    this.props.RouteChange('home')
                }
            })

    }
    render(){
        return (
            <article className="br3 ba dark-gray b--black-10 mv6 shadow-5 w-100 w-50-m w-25-l mw5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input 
                        onChange={this.onNameChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="text" 
                        name="name"  
                        id="name"/>
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input 
                        onChange={this.onEmailChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="email" 
                        name="email-address"  
                        id="email-address"/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                        onChange = {this.onPasswordChange}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="password" 
                        name="password"  
                        id="password"/>
                    </div>
                    </fieldset>
                    <div className="">
                    <input 
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Register"
                        //mivel ha a fn-t hívnánk a végén ()-vel, rögtön aktiválódna, egy újabb funkcióba tesszük, ami csak akkor aktiválódik, ha megtörténik az onClick event
                        onClick={this.onSubmitSignIn}
                    />
                    </div>
                </div>
            </main>
            </article>

        );
    }
}

export default Register;