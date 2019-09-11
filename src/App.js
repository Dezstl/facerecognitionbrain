import React, {Component} from 'react';
import './App.css';
import Naviation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRegonition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'b28e9e306cf345828fd230b1b79ef8e6'
});

const particalConst = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: 0,
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocation = (data) => {
    console.log(data);
    
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: face.left_col * width,
      topRow: Number(face.top_row * height),
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imgUrl: this.state.input})

    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input
      )
    .then(response => {
      fetch('http://localhost:3030/image', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count} ));
      })
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(error => console.log(error));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particalConst} />
        <Naviation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { this.state.route === 'home' ? 
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
            <FaceRegonition imgUrl={this.state.imgUrl} box={this.state.box} />
          </div> 
          : (this.state.route === 'signin' ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : 
              <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            ) }
      </div>
    );
  }
  
}

export default App;
