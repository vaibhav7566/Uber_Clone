import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setWaitingForDriver(false);
          
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-3">Meet at the pickup location</h3>


      <div className="flex justify-between items-center flex-col gap-2">

        <div className='flex justify-between gap-15 items-center'>
            <img
          className="h-20 w-20 rounded-full object-cover"
          src="https://imgs.search.brave.com/jzhJIpOX_gLlpKvuLSKseIb7QaLrw9kGdkNE9FqeAJ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N3ZWVrLmluL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9BZXN0aGV0/aWMtR2lybC1QaWMt/Mi5qcGc"
          alt=""
        />

        <div className='text-right'>
            <h2 className="text-xl font-medium">Tavishi</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>MP04 MD 5861</h4>
                <h4 className='text-sm text-gray-600'>Maruti Suzuki Alto</h4>
                <h5 className="text-gray-800 -mt-1"> <i className="ri-star-fill text-yellow-500 "></i> 4.5</h5>
{/* <h4 className="text-gray-600">Driver is on the way</h4> */}
        </div>
        </div>
        
        <div className="w-full flex flex-col   mt-1">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-lg "></i>
            <div>
              <h3 className="font-medium text-lg">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                Kankariya Talab Ahmedabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                Kankariya Talab Ahmedabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Select Payment Option</h3>
              <button className="text-small -mt-1 text-gray-600 ">
                bkejsbfkndn
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default WaitingForDriver