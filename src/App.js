import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './Components/Navigation/Navigation.js'
import Logo from './Components/Logo/Logo.js'
import ImageLinkForm from  './Components/ImageLinkForm/ImageLinkForm.js'
import FaceDetect from './Components/FaceDetect/FaceDetect.js'
import Rank from './Components/Rank/Rank'
import Signin from './Components/Signin/Signin.js'
const app = new Clarifai.App({
 apiKey: 'c6112d09dcad498cb7dfe82518dee266'
});
const particlesOption={
                 particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}


class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
    }
  }
  calculateFaceLocation=(data)=>{
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }
  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box:box})
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value});

  }
  onButtonSubmit=(event) =>{
    this.setState({imageUrl: this.state.input});
    app.models.predict( Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response=>this.displayFaceBox(this.calculateFaceLocation(response))) 
      .catch(err=>console.log(err));

      // do something with response
    
  
  
  }
   render() {
  
  return (
    <div className="App">
        <Particles className='particles'
              params={particlesOption}
        />
      <Navigation/>
      <Signin/>
      
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange}
       onButtonSubmit={this.onButtonSubmit}/>
      
      <FaceDetect box={this.state.box} imageUrl={this.state.imageUrl}/>
    </div>
  );
}
}

export default App;
