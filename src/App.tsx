import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-grid-system';

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
          selectedCity: data[0].id
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
        <div className="selectDiv">
        <select onChange={this.handleChange.bind(this)}>
          {cities.map((city:any) => 
              <option value={city.id}>{city.name}</option>
              )}
        </select>
        </div>
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


    return(
      <div>
      <WeatherDetails weather={weather}></WeatherDetails> 
       
        <div className="basicInfoContainer">
           
          {weather.map((cityWeather:any) => 
     
         <div className="basicInfo">
          
         <div className="col40 dayName"><b>{this.getFullNameOfDay(new Date(cityWeather.date).getDay())}</b> </div>
         <div className="col15 image"><img src={require('./'+ cityWeather.type+'.png')} /> </div>
         <div className="centerIt">
           <div className="temperatureContainer">
         <div className="col15mob">{Math.round((5/9 * (cityWeather.temperature) + 32))}&deg; </div>
         <div className="col15mob  gray temperature2">{cityWeather.temperature}&deg;</div>
         </div>
         <div className="col15 itemPollen"><span className="gray">Pollen</span> {cityWeather.pollenCount}</div>
         </div>
         
       </div>

       )}
       </div>
      </div>
       
    )
  }
}
type WeatherDetailsProps = {
  weather: []
}
class WeatherDetails extends Component<WeatherDetailsProps, {}> {

  constructor(props: WeatherDetailsProps){
    super(props)
  }

  formatThatDate(date: Date){
    var currentDate = new Date();
    var ending = () => {
      var d = date.getDay()
      if (d > 3 && d < 21) return 'th'; 
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
  }
    }
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return days[date.getDay()] + ", " + months[date.getMonth()-1] + " " + date.getDate() + ending();
  }
  render(){
    return(
    this.props.weather.map((detailed:any) => 
      {
        if(new Date(detailed.date).getDay() === new Date().getDay()){
          return (
            <div className="detailedWeatherContainer">
                <div className="dateAndTypeDeatiledWeather">
                {this.formatThatDate(new Date(detailed.date))}<br></br>
                {detailed.type}<br></br>
                </div>
                <div className="cont">
                <div className="detailedRight">
                <span className="gray">Precipitation: </span> {detailed.precipitation}% <br></br>
                <span className="gray">Humidity: </span>{detailed.humidity}% <br></br>
                <span className="gray">Wind: </span>{detailed.windInfo.speed} mph {detailed.windInfo.direction} <br></br>
                <span className="gray">Pollen Count: </span>{detailed.pollenCount} <br></br>
              </div>
                <div className="datiledLeft">
                <br></br> 
                  <div className="bigImage">
                <img src={require('./'+ detailed.type+'.png')}/>
                <span className="bigTemperature higher">{detailed.temperature}&deg;</span>
                </div>
                
                </div>
                
              </div>
              </div>
            
          )
        } else {
          return "";
        }
      }
    )
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
