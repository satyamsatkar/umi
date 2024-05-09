import React, { useEffect, useState } from 'react'
import InnerHeader from '../Layout/InnerHeader'
import SearchIcon from '@mui/icons-material/Search';
import { BASE_URL, IMAGE_URL } from '../Utils/BaseUrl';
import axios from 'axios';
import nonveg from '../../Images/Non.png';
import veg from '../../Images/veg.png'

const SearchPage = () => {

    const [search , setSearch] = useState('')
    const [popular, setPopular] = useState([])
    const getPopular = async () => {
        const response = await axios.get(`${BASE_URL}/products`);

        console.log(response);
        setPopular(response.data);
    }

    useEffect(() => {
        getPopular();
    }, [])


    
    const [itemCounts, setItemCounts] = useState({});

    // Function to handle item count changes
    const handleItemCountChange = (itemId, newCount) => {
        setItemCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: newCount
        }));
    };


    return (
        <div>
            <InnerHeader />
            <div className=' position-relative m-2'>
                <input onChange={(e) => setSearch(e.target.value)} className="border-yellow p-1 w-100" style={{ outline: "none" }} type='search' placeholder='Search (eg. Pav Bhaji)' />
            </div>

            <div className='menu-pro-card  '>
                {popular.filter((item) => (item.title.toLowerCase()).includes(search)).map((item) => {
                    return (
                        <div className='row p-1 border rounded-3 my-1'>
                            <div className='col-4 col-md-4 '>
                                <div className='position-relative rounded pro-img d-flex'>
                                    <img className='rounded' src={`${IMAGE_URL}/product/` + item.upload_image} alt='' />
                                    <h3>Upto 30% Off</h3>
                                </div>
                            </div>

                            <div className='col-8 col-md-8 pro-description position-relative'>
                                <h2>{item.title}</h2>
                                <p>VENDOR NAME</p>

                                {item.type == "1" ? <img className='veg-icon' src={veg} alt='' /> : <img className='veg-icon' src={nonveg} alt='' />}

                                {/* <p className='disc'>
                                    {item.description}
                                </p> */}
                                <p className='disc py-1'>
                                    {item.type == "2" ? "Contain Eggs" : ""}<span className='text-danger'>*</span>
                                </p>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h2>Rs.{item.price}/-</h2>

                                    <div className='menu-add-remmove d-flex align-items-center '>
                                        <button onClick={() => {

                                            const newCount = itemCounts[item.id] ? itemCounts[item.id] - 1 : 0;
                                            handleItemCountChange(item.id, newCount)

                                        }} className='minus'>
                                            -
                                        </button>
                                        <input value={itemCounts[item.id] || 0} className='text' disabled />
                                        <button onClick={() => {
                                            const newCount = (itemCounts[item.id] || 0) + 1;
                                            handleItemCountChange(item.id, newCount);

                                            const data = {
                                                cat_id: item.cat_id,
                                                pro_id: item.id,
                                                pro_name: item.title,
                                                price: item.price,
                                                p_qty: newCount,
                                                orderid: localStorage.getItem("orderid"),
                                                userId: localStorage.getItem("food_id")
                                            };

                                            axios.post(`${BASE_URL}/addToCart`, data)
                                                .then((res) => {
                                                    if (res.data[0] && res.data[0].orderid) {
                                                        localStorage.setItem("orderid", res.data[0].orderid);
                                                    }
                                                });
                                        }} className='plus'>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}


            </div>
        </div>
        
    )
}

export default SearchPage