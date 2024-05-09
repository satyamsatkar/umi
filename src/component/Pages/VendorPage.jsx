import React, { useEffect, useState } from 'react'
import dish from '../../Images/dish.png'
import veg from '../../Images/veg.png'
import SearchIcon from '@mui/icons-material/Search';
import CartFooter from '../Layout/CartFooter';
import nonveg from '../../Images/Non.png';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../Utils/BaseUrl';
const VendorPage = () => {
    const [count, setCount] = useState(0)
    const [click, setclick] = useState('')
    const [toggle, settoggle] = useState(false);
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [company , setCompany] = useState('')
    const [address, setaddress] = useState('')
    
    const handleclick = (e) => {
        settoggle(true)
        settoggle2(false);        
        setclick(e.target.value)
    }

    const [detail, setdetail] = useState([])
    const [open, setOpen] = useState(false)
    const handleclick2 = (id) => {
        setOpen(true)

        axios.post(`${BASE_URL}/detail_product`, { proid: id })
            .then((res) => {
                setdetail(res.data[0])
            })

    }
    const [toggle2, settoggle2] = useState(false);
    const handleclick3 = (e) => {
        settoggle(false)
        settoggle2(true);
         setclick(e.target.value)
      }

    const handleclose = () => {
        setOpen(false)
        setdetail([])
    }
    const { vendid } = useParams()


    async function getcatlisting() {
        axios.post(`${BASE_URL}/getvendorlisting`, { vendid: vendid })
            .then((res) => {
                setData(res.data)
                setCompany(res.data[0].company_name)
                setaddress(res.data[0].city)
            })
    }

    useEffect(() => {
        getcatlisting()
    }, [vendid])


    const [itemCounts, setItemCounts] = useState({});

    // Function to handle item count changes
    const handleItemCountChange = (itemId, newCount) => {
        setItemCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: newCount
        }));
    };


    return (
        <div style={{ paddingBottom: "90px" }}>

            <div className='menu-header p-3'>
                <p className=''><span className='p-1 '>4.5 ⭐</span></p>
                <h2>{company}</h2>
                {/* <span className='p-3'>FAST FOOD</span> */}
                <h5 className='pt-2'>{address}</h5>
            </div>
            <div className='row p-3 menu-search'>

                <div className='col-md-7 col-7 position-relative'>
                    <input onChange={(e) => setSearch(e.target.value)} className="border-yellow p-1 w-100" type='search' placeholder='Search (eg. Pav Bhaji)' />
                    <SearchIcon sx={{ color: "lightgray" }} className='search-icon' />
                </div>
                <div className='col-md-5 col-5 row dash-search align-items-center' >

                    <div className='col-md-6 col-6 text-center px-1 '>
                        <button style={{ color: "green" }} value='1' onClick={(e) => handleclick(e)} className={toggle === false ?"border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100" }><img style={{ width: "10px", paddingRight: "1px" }} src={veg} alt='' />VEG</button>

                    </div>
                    <div className='col-md-6 col-6 text-center'>
                        <button type='button' name='' style={{ color: "red" }} value='2' onClick={(e) => handleclick3(e)} className={toggle2 ===false ? "border-yellow  p-1 w-100" : "border-yellow p-1  back-yellow w-100"} ><img style={{ width: "10px", paddingRight: "1px" }} src={nonveg} alt='' />NON VEG</button>
                    </div>
                </div>


            </div>

            <div className='menu-items p-3'>

                <div className='menu-pro-card  '>
                    {data.filter((item) => (item.type).includes(click)).filter((item) => (item.title.toLowerCase()).includes(search)).map((item) => {
                        return (
                            <div className='row p-1 border rounded-3 my-1'>
                                <div className='col-4 col-md-4 '>
                                    <div className='position-relative rounded pro-img d-flex'>
                                        <img className='rounded' src={`${IMAGE_URL}/product/` + item.upload_image} alt='' />
                                        <h3>Upto 30% Off</h3>
                                    </div>
                                </div>

                                <div onClick={()=>handleclick2(item.id)} className='col-8 col-md-8 pro-description position-relative'>
                                    <h2>{item.title}</h2>
                                    <p>{item.company_name}</p>

                                    {item.type == "1" ? <img className='veg-icon' src={veg} alt='' /> : <img className='veg-icon' src={nonveg} alt='' />}

                                    {/* <p className='disc'>
                                    {item.description}
                                </p> */}
                                    <p className='disc py-1'>
                                      {/*  {item.type == "2" ? "Contain Eggs" : ""}<span className='text-danger'>*</span>*/}
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



            {open ? <div className='overlay'></div> : null}


<div className={open ? 'dish-details show-details positon-relative' : 'dish-details'}>
    {open ? <div className='close-btn'>
        <button onClick={handleclose}>Close &nbsp;X</button>
    </div> : null}

    <div className='pro-detail-card m-2 p-2'>
        <div className='detail-img d-flex justify-content-center align-items-center'>
            <img src={`${IMAGE_URL}/product/` + detail.upload_image} alt='' />

        </div>

        <div>
            <div className='d-flex align-items-center pt-3 justify-content-between'>
                <div className='d-flex align-items-center'>
                    <h2 className='mb-0'>{detail.title}</h2>
                    {detail.type == "1" ? <img className='mx-1' style={{ width: "17px", height: "17px" }} src={veg} alt='' /> : <img className='mx-1' style={{ width: "17px", height: "17px" }} src={nonveg} alt='' />}
                </div>

                <div className='d-flex align-items-center '>
                    <i class="ri-heart-line text-danger"></i>
                    <i class="ri-share-forward-box-fill mx-2 share-icon"></i>
                </div>
            </div>
            <p>Rs.{detail.price}/-</p>
            <p className=''><span className='p-1 mb-3'>4.5 ⭐</span></p>

            <p className='disc'>
                {detail.description}
            </p>

        </div>
    </div>


</div>

{open ? <div className='row cart-footer p-2 '>

    <div className=' d-flex align-items-center col-md-3 col-3 '>
        <button onClick={() => {

            const newCount = itemCounts[detail.id] ? itemCounts[detail.id] - 1 : 0;
            handleItemCountChange(detail.id, newCount)

        }} className='minus'>
            -
        </button>
        <input value={itemCounts[detail.id] || 0} className='text' disabled />
        <button onClick={() => {
            const newCount = (itemCounts[detail.id] || 0) + 1;
            handleItemCountChange(detail.id, newCount);

            const data = {
                cat_id: detail.cat_id,
                pro_id: detail.id,
                pro_name: detail.title,
                price: detail.price,
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

    <div className='col-md-9 col-9 text-center'>
        <Link to="/cart"> <button>View Cart</button></Link>
    </div>
</div> : null}
            <CartFooter />

        </div>
    )
}

export default VendorPage