import React, { useEffect, useState } from 'react'
import Banner from './DashComponent/Banner'
import Category from './DashComponent/Category'
import PopularDish from './DashComponent/PopularDish'
import DashSearch from './DashComponent/DashSearch'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import veg from '../../Images/veg.png'
import nonveg from '../../Images/Non.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Utils/BaseUrl'

const Dash = () => {
  const [click, setclick] = useState('')
  const [toggle, settoggle] = useState(false)
  const [toggle2, settoggle2] = useState(false);
  const [Vendor, setVendor] = useState([]);
  const [VendorProducts, setVendorProducts] = useState([]);
  const handleclick = (e) => {
    settoggle(true)
    settoggle2(false);
     setclick(e.target.value)
  }
  const handleclick2 = (e) => {
    settoggle(false)
    settoggle2(true);
     setclick(e.target.value)
  }

 

  const [location, setLocation] = useState([]);

  const getLocation = async () => {
    const data = {
      user_id  : localStorage.getItem("food_id")
    }

    const response = await axios.post(`${BASE_URL}/getLocation`, data);


    setLocation(response.data);
  }



  const getVendorList = async()=>{
    const response = await axios.get(`${BASE_URL}/vendorList`);

    console.log(response.data);
    setVendor(response.data);
  }

  const Navigate = useNavigate()

  const getVendorSpecificProducts= async(id)=>{

    const response = await axios.post(`${BASE_URL}/vendorProducts`, {
      vendorId : id
    })

    console.log(response.data);
    setVendorProducts(response.data);

    Navigate(`/vendorpage/${id}`)
  }
  useEffect(() => {
    // getLocation();
    getVendorList();
  }, [])


  const handleredirect = () =>{
alert("EE")
  }
  return (
    <div>
      <Banner />
      <div className='px-3 pt-1 dash-search'>
        <div className='row'>

          <div className='col-md-7 col-7 position-relative'>
            {/* <input className="border-yellow p-1" type='text' placeholder="ANDHERI-POWAI-CAFE-1" alt='' disabled /> */}
            <select className="border-yellow p-1 w-100" onChange={(e) =>{
               getVendorSpecificProducts(e.target.value)}}>
              {
                Vendor?.map((item)=>{
                  return(
                    <option onClick={handleredirect} key={item.id} value={item.id}> <Link to={`/menupage/${item.id}`}> {item.company_name}</Link></option>
                  )
                })
              }
            </select>
            {/* <LocationOnIcon className='search-icon' /> */}
          </div>

          <div className='col-md-5 col-5 '>
         <select className="border-yellow w-100 px-1 py-1 mx-1" onChange={(e) =>{
               getVendorSpecificProducts(e.target.value)}}>
              <option>SELECT VENDOR</option>
              {/* <option>1</option>
              <option>2</option>
              <option>3</option> */}
              {
                Vendor?.map((item)=>{
                  return(
                    <option onClick={handleredirect} key={item.id} value={item.id}> <Link to={`/menupage/${item.id}`}> {item.company_name}</Link></option>
                  )
                })
              }
            </select>
          </div>

        </div>
        <div className='row py-2'>

          <div className='col-md-7 col-7 position-relative'>
            <Link to="/searchpage">  <input className="border-yellow p-1" type='search' placeholder='Search (eg. Pav Bhaji)' /></Link>
            <SearchIcon sx={{ color: "lightgray" }} className='search-icon' />
          </div>
          <div className='col-md-5 col-5 row align-items-center'>
            <div className='col-md-6 col-6 text-center px-1'>
              <button style={{ color: "green" }} value="1" onClick={(e) => handleclick(e)} className={toggle === false ?"border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100" }><img style={{ width: "10px", paddingRight: "1px" }} src={veg} alt='' />VEG</button>

            </div>
            <div className='col-md-6 col-6 text-center'>
              <button style={{ color: "red" }} value="2" onClick={(e) => handleclick2(e)} className={toggle2 === false ?"border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100" }><img style={{ width: "10px", paddingRight: "1px" }} src={nonveg} alt='' />NON VEG</button>
            </div>
          </div>

        </div>
      </div>
      <Category />
      <PopularDish click={click} vendorProducts={VendorProducts}/>
    </div>
  )
}

export default Dash