import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
//meghatározzuk az appot ami a clarifal api
const app = new Clarifai.App({
  apiKey: 'eaa1ffa7c6894d709dab5867ce64b358'
 });
//a practicles (a háttérben futó gpuzabáló) tulajdonságait be lehet állítani itt. Ezeket a tulajdonságokat egy konstansban tároljuk, majd csatoljuk az elenhez
const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 300
        }
      }
    }
}

class App extends Component {
  //SMART COMPONENT révén az appnak beállítjuk a STATE-jét. 
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }
  //ez a függvény arra szolgál, hogy a clarifal apiból megkapott adatokat tárolja. Az api visszaad egy értéket (data), aminek számos tulajdonsága van, ebben a bounding box, azaz a kép arányainak tekintetében vett értékeket kapjuk meg. Először vesszük az input által kapott képet, annak szélességét, és magasságát, majd visszaadjuk a kiszámolt 4 oldalát a felismert arc keretének
calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width, height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}
//ezt a függvényt alkalmazzuk arra, hogy az App.state.box elemet meghatározzuk. Egy objektumot fogunk visszakapni az előző funkció paramétereivel
displayFaceBox = (keret) => {
  this.setState({box: keret});
}
//ezzel a fügvénnyel állítjuk be az App.state.inputot, az ImageLinkForm elemben lévő input mezőből kinyert stringgel
onInputChange = (event) => {
  this.setState({input: event.target.value})
}
//ez a funkció szolgál arra, hogy az App.state.route tulajdonságot beállítsuk. Az App.state.route állapotának függvényében meghatározzuk az App.state.isSignedIn tulajdonságot is. Ha a route aktuális állapota signout (tehát nincs bejelentkezve), akkor ezt az isSignedIn állapotban is jelezzük. Ha a route azt jelzi, hogy a kezdőoldalon van a felhasználó, akkor az isSignedIn igaz, ugyanis akkor be van jelentkezve
onRouteChange = (rou) => {
  if(rou === 'signout'){
    this.setState({isSignedIn: false})
  } else if (rou === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: rou})
}
//ez a funkció az App.state.input alapján beállítja az imageUrl állapotát is. (valójában ugyanaz a kettő, de külön kezeljük) a clarifal app .predict módszerében tulajdonságként meghatározzuk először, hogy az arcfelismerő modellt szeretnénk használni, majd hogy a kép URL-je, amire ezt szeretnénk használni az App.state.input. Ez alapján kapunk egy választ, ami a clarifal szerverén elvégzi az arcfelismerést. A választ úgy kezeljük, hogy a calculatefacelocation függvény paramétereként állítjuk be. Ezáltal a funkció a választ feldolgozza, és a displayfacebox funkcióján keresztül beállítja App.state.box állapotot.
onSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
}

  render() {
    //először beállítjuk a particles háttérelem jellemzőit a már elkészített practiclesOptions elemünkkel, a practicles jellemzőjeként
    //majd beállítjuk a navigációt. A navigációnak két jellemzője van. Az isSignedIn jellemzőt az Appon keresztül állítjuk be, a route függvénében. A navigation is képes a route változtatására az alapján, hogy a navigation melyik linkjét változtatjuk.
    //a háttér, és a navigáció mindig ugyanott van (attól függetlenül, hogy a navigáció változik az állapotoktól függően). A fő tartalomnak viszont több típusa van. Az alap a bejelentkezés, aztán vagy a regisztráció, vagy pedig maga az app. Azt, hogy melyik jelenik meg a képernyőn, azt a route állapota határozza meg. Ezt egy if else függvénnyel döntjük el. Ha a route állapota home (az app jelzője), akkor az appot jeleníti meg. Ha nem, akkor újabb if else következik. Ha a route állapota signin, akkor a bejelentkezési oldalt jeleníti meg, ha pedig nem signin, akkor a regisztrációs oldalra vezet.
    //az ImageLinkFormnak két jellemzője van, az inputchange, ami az elemen belül, az input mezőn keresztül állítódik be, és küldi az App-nak. Az ImageLinkFormon belül lévő input jellemzőjeként beállítottuk, hogy ha változik (megtörténik az onChange event), akkor hívja a szüleje jellemzőjét, az InputChange-t. Ez továbbítja az App.onInputChange-nek a hívást, az pedig átállítja az input állapotát a beviteli mezőre.
    //a következő jellemző a Submit. Az ImageLinkForm-on belüli gomb az onClick event hatására hívja a jellemzőt (Submit), ami pedig hívja az App.onSubmit funkciót, ami beállítja az imageUrl állapotát, ezzel párhuzamosan pedig hívja a clarify apit.
    //a FaceRecognition egyik jellemzője, a box az App.state.box-ból nyeri ki az adatokat, és dolgozza fel az elemen belül, egy abszolút pozícionált divvel, css paraméterekkel jelezve a keretet (az arcfelismerés eredményeit). A másik jellemző az image, ami pedig az App.imageUrl-ből nyeri ki a linket, amit a FaceRecognitionon belül az img src-n belül határozunk meg.
    //végül pedig a signin és a register elemnél egyaránt, az elemen belül beállítjuk a RouteChange jellemzőt, azt pedig itt, az Appban küldjük az App-onRouteChange funkciónak, ami beállítja az állapotot.
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={this.state.isSignedIn} RouteChange={this.onRouteChange}/>
        {this.state.route === 'home' 
        ?
        <div>
          <Logo/>
          <Rank/>
          <ImageLinkForm 
            InputChange={this.onInputChange} 
            Submit={this.onSubmit}/>
          <FaceRecognition 
            box={this.state.box} 
            image={this.state.imageUrl}/>
        </div>
        : (
          this.state.route === 'signin'
          ? <Signin RouteChange={this.onRouteChange}/>
          : <Register RouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
