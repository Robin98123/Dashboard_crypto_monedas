import {useEffect, useState} from 'react' // se importan los Hooks
import "./App.css"; // Importamos nuestra hoja de estilos
import { Line } from "react-chartjs-2";
// Importamos los componentes principales de la aplicación
import axios from 'axios'; 
import CardPrincipal from './CardPrincipal';
import TableCoins from './TableCoins';
import Card from './Card'
import Convert from './Convert';
import Footer from './Footer'
import Header from './Header'
import {ThemeProvider} from "./Context/ThemeProvider";

//Exportamos los estados principales

export default function App() {
  //Coins: almacena el valor de todas las monedas que vienen de la api
  const [coins, setCoins] = useState()
  //Currency: almacena el valor de todas las divisas que vienen de la api
  const [currency, setCurrency] = useState()
  //SelCur: almacena el valor de divisa que esocge el usurio.
  const [selCur, setSelCur] = useState("usd")

  //consumimos la api por medio de async dentro de una variable para contenerla
  const getData = async () =>{
    //se alamacena la url de la api que se pidio de la pagina de gecko
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selCur}&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d%2C90d%2C1y`)
    //se contiene el arreglo de objeto dentro de una json
    const json = await response.json()
    const response_cur = await fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
    const cur = await response_cur.json()
    setCoins(json)
    setCurrency(cur)
  }
  useEffect(() => {
    getData()
  },[])
  useEffect(() => {
    getData()
  },[selCur])

  //retornamos el valor de cargando mientras toda la aplicacion se renderiza
  return (
    !coins ? "Cargando..." :(
    <div className='App'>
       <ThemeProvider>
        <Header currencys={currency} fun={setSelCur} cur={selCur}/>
       </ThemeProvider>
      <main>
        <CardPrincipal json={coins[0]} cur={selCur}/>
        <div className="cards_con">
          { coins.map(({id,symbol, image, current_price,price_change_percentage_30d_in_currency},index) =>{
            if(index != 0) {
             return <Card key={index} price={`${symbol} - ${current_price} ${selCur} `} porcentaje={deleteDec(price_change_percentage_30d_in_currency,2)} img={image} coinId={id} cur={selCur}/>
            }
          })
          }
        </div>
      </main>
      <Convert/>
      <TableCoins coins={coins}/>
      <Footer/>
    </div>
  )
  )

}

//funcion usada para resetear los decimales
export function deleteDec(val, decimal) {
  return val.toFixed(decimal)
}

//asigna el color verde o rojo dependiendo del numero 
export function colorDec(num){
  return num > 0 ? "green" : "red"
}

//funcion para separar los miles
export const numberF = Intl.NumberFormat("es-ES")
