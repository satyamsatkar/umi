import React from 'react'
import img from '../../Images/umiimg.png'
import imgtext from '../../Images/UMI_text.png'
const Splash = () => {
    return (
        <div className='splash-main' >
            <img src={img} alt='' />
            <div className='text-center'>
                <img className='splash-text' src={imgtext} alt='' />

            </div>
        </div>
    )
}

export default Splash