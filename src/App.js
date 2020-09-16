import React, { useEffect, useState } from 'react';
import './App.css';
import {Card, CardContent, FormControl, MenuItem, Select} from "@material-ui/core"
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import {prettyPrintStat, sortData} from "./utils";
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral"
function App() {
  
  const [countries, setCountries] = useState([
    // "USA", "Nigeria", "India"
  ])
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3); // like how many times btn is clicked to zoom on default
  const [casesType, setCasesType] = useState("cases");

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    // setInputCountry(country)
    // try to do this without the async later
    const url =
    countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setInputCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      console.log(data)
    })
  }
  // console.log(countryInfo)
  

  // To set stats to worldwide on startup
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // To set get all countries for the select option
  useEffect(() => {
    // run everytime the app component loads && if value in [] changes
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map(country => ({
          id:country.countryInfo._id,
          name:country.country,
          value: country.countryInfo.iso2 // UK, USA, NG
        }) );
        const sortedData = sortData(data)
        setCountries(countries)
        setTableData(sortedData)
        setMapCountries(data)
        // console.log(countries)
        // for(let x in countries){
        //   console.log(x)
        // }
      })
    };
    getCountriesData();
  }, [])

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map(country =>{
              return(
                <MenuItem value={country.value} key={country.id}>{country.name}</MenuItem>
              )
            })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>
      <div className="app__right">
      <Card>
        <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default App;
