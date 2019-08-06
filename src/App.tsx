import React, { Component } from 'react';
import './App.css';

type DropdownTypeState = {
  cities: [],
  selectedCity: string,
}

class DropdownList extends Component <{}, DropdownTypeState>{

  constructor(props: String){
    super(props)
    this.state = {
      cities: [],
      selectedCity: "Not chosen",
    }
  }

  componentDidMount(){
    fetch('http://dev-weather-api.azurewebsites.net/api/city')
      .then(res => res.json())
        .then(data => this.setState({
          cities: data, 
        }))
  }

  handleChange(e:any){
    this.setState({
      selectedCity: e.target.value
    })
  }

  render(){

    const {cities, selectedCity} = this.state;

    return (

      <div>
        <select onChange={this.handleChange.bind(this)}>
          {cities.map((city:any) => 
              <option value={city.id}>{city.name}</option>
              )}
        </select>
        <Weather cityId={parseInt(this.state.selectedCity)}></Weather>
      </div>
    )
  }

  
}

type WeatherPropsType = {
  cityId: number
}

type WeatherStateType = {
  weather: [],
  isLoading: Boolean
}


class Weather extends Component <WeatherPropsType,WeatherStateType>{

  constructor(props: WeatherPropsType){
    super(props);
    this.state = {
      weather: [],
      isLoading: false
    }
  }

  componentWillReceiveProps(){

    var speedDate = require('speed-date');
    let date = new Date();
    let formatter = speedDate('YYYY-MM-DD');
    let formatedDate = formatter(date);

    this.setState({
      isLoading: true
    })
    if(!isNaN(this.props.cityId)){
    fetch('http://dev-weather-api.azurewebsites.net/api/city/'+this.props.cityId+'/weather?date='+formatedDate)
      .then(res => res.json())
        .then(data => this.setState({
          weather: data,
          isLoading: false
        }))}
  }

  getFullNameOfDay(date: any){
    var currentDate = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return date == currentDate.getDay() ? "Today" : days[date];
  }
  render(){

    const{weather, isLoading} = this.state;
   
    if(isLoading){
      return <p>Loading...</p>
    }

    return(
      
      <div className="basicInfoContainer">
       
      {weather.map((cityWeather:any) => 
        <div className="basicInfo">
        
        <h4>{this.getFullNameOfDay(new Date(cityWeather.date).getDay())}</h4>
        <img src={require('./'+ cityWeather.type+'.png')} />
        <h4>Temperature: {cityWeather.temperature} </h4>
        <h5>Pollen {cityWeather.pollenCount}</h5>
        
      </div>
      
      )}
        
        
      </div>
      

    )
  }
}

const App: React.FC = () => {
  return (
    <div className="App">
      <DropdownList> </DropdownList>
    </div>
  );
}

export default App;
