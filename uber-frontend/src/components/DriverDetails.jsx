import React from 'react'
import { useSelector } from 'react-redux';


const DriverDetails = () => {
  const User = useSelector((state) => state.auth.user);

  return (
    <div>
         <div className="flex items-center justify-between mb-5">
          <div className="flex items-center justify-start gap-3">
            <img className="h-11 w-11 rounded-full object-cover" src="https://imgs.search.brave.com/Jp_TVZo6jxEYGqfKhL2ccL630RX-lmTFERJqJ6oa-ww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N3ZWVrLmluL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9BZXN0aGV0/aWMtR2lybC1QaWMu/anBn" alt="" />
            <h4 className="text-lg font-medium ">{User?.name}</h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold">₹310</h4>
            <p className="text-sm text-gray-600">Earned Today</p>
          </div>
        </div>

        <div className="flex p-3 bg-gray-200 rounded-3xl justify-center gap-5 items-start">
          <div  className="text-center">
            <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-small text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin ri-speed-up-fill"></i>
            <h5 className="text-lg font-medium">15</h5>
            <p className="text-small text-gray-600">Rides Completed</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
            <h5 className="text-lg font-medium">4.9</h5>
            <p className="text-small text-gray-600">Rating</p>
          </div>
        </div>
    </div>
  )
}

export default DriverDetails