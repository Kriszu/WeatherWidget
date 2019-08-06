import React, { Component } from 'react';
import './App.css';

type DropdownTypeState = {
  cities: [],
  selectedCity: string,
  isLoading: Boolean
}

class DropdownList extends Component <{}, DropdownTypeState>{

  constructor(props: String){
    super(props)
    this.state = {
      cities: [],
      selectedCity: "Not chosen",
      isLoading: false
    }
  }

  componentDidMount(){

    this.setState({
      isLoading: true
    });

    fetch('http://dev-weather-api.azurewebsites.net/api/city')
      .then(res => res.json())
        .then(data => this.setState({
          cities: data,
          isLoading: false  
        }))
  }

  handleChange(e:any){
    this.setState({
      selectedCity: e.target.value
    })
  }

  render(){

    const {cities, selectedCity, isLoading} = this.state;

    if(isLoading){
      return <p>Loading please wait...</p>
    }

    return (

      <div>
        <select onChange={this.handleChange.bind(this)}>
          {cities.map((city:any) => 
              <option value={city.id}>{city.name}</option>
              )}
        </select>
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
