import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { Card, FormControl, MenuItem, Select , CardContent} from '@material-ui/core';
import { sortData } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import { prettyPrintStat } from './util';
function App() {
  const [countries , setCountires] = useState([]);
  const [country , setCountry] = useState("worldwide");
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData , setTableData] = useState([]);
  const [mapCenter , setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom , setMapZoom] = useState(2);
  const [mapCountries , setMapCountries] = useState([]);
  const [casesType , setCasesType] = useState("cases");
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then(data =>{
      setCountryInfo(data);
    })
  },[]);
  useEffect(()=>{
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) =>response.json())
      .then((data) =>{
        const countries = data.map((country) =>(
 
          {
            name : country.country , 
            value : country.countryInfo.iso2,
          }
        ));
        const sortedData = sortData(data);
        setCountires(countries);
        setTableData(sortedData);
        setMapCountries(data);
      });
    };
    getCountriesData();
  },[]);
  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    const url = countryCode==="worldwide"?"https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response=>response.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data); //All the data from country code entered
      countryCode === "worldwide"
      ? setMapCenter([34.80746, -40.4796])
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })  
    //console.log(countryCode);
  };
  console.log(countryInfo);
  console.log(typeof(countryInfo.cases));
  return (
    <div className="app">
    <div className = "app__left">
    <div className="app__header">
        <h1>COVID - 19 TRACKER</h1>
        <FormControl className = "app__dropdown">
          <Select
          variant = "outlined"
          onChange={onCountryChange}
          value = {country} //it will display the default value when it matches a menuitem value and it showa the text inside tha menuItem tag
          >
          <MenuItem value = "worldwide">WorldWide</MenuItem>
            {countries.map((country) =>(
              <MenuItem value = {country.value}>{country.name}</MenuItem>
            ))}
            {/* <MenuItem value = "worldwide">WorldWide</MenuItem>
            <MenuItem value = "worldwide">WorldWide</MenuItem>
            <MenuItem value = "worldwide">WorldWide</MenuItem>
            <MenuItem value = "worldwide">WorldWide</MenuItem> */}
          </Select>
        </FormControl>
        </div>
      <div className = "app__stats">
         <InfoBox isRed active={casesType === "cases"} onClick={e=>setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}/>
         <InfoBox active={casesType === "recovered"} onClick={e=>setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
         <InfoBox isGrey active={casesType === "deaths"} onClick={e=>setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
      </div>
      <Map
      casesType = {casesType}
      countries = {mapCountries}
      center = {mapCenter}
      zoom = {mapZoom}
       />
    </div>
    <Card className="app__right">
    <CardContent>
      <h3>Live Cases by country</h3>
      <Table countries={tableData}/>
      <h3 className="app__graphTitle">WorldWide New {casesType}</h3>
      <LineGraph className="app__graph" casesType={casesType}/>
    </CardContent>
    </Card>
    </div>
  );
}

export default App;
