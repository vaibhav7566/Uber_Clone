// import React, { useRef, useState } from "react";
// import {gsap} from "gsap";
// import {useGSAP} from "@gsap/react";
// import 'remixicon/fonts/remixicon.css'
// import LocationSearchPanel from "../components/LocationSearchPanel";

// const RiderHome = () => {
//   const [pickup, setPickup] = useState("");
//   const [destination, setDestination] = useState("");
//   const [panelOpen, setPanelOpen] = useState(false);
//   const panelRef = useRef(null)
//   const panelCloseRef = useRef(null)
//   const submitHandler = (e) => {
//     e.preventDefault();
//   };

//   useGSAP(() => {
//      if (panelOpen) {
//       gsap.to(panelRef.current, {
//         height: "70%",
//         duration: 0.5,
//         ease: "power2.inOut",
//         display: "block",
//       });
//       gsap.to(panelCloseRef.current, {
//         opacity: 1,
//       })
//     } else {
//       gsap.to(panelRef.current, {
//         height: "0%",
//         duration: 0.5,
//         ease: "power2.inOut",
//         display: "none",
//       });
//       gsap.to(panelCloseRef.current, {
//         opacity: 0,
//       })
//     }
//   },[panelOpen])

//   return (
//     <div className="h-screen relative">
//       <h1 className="text-3xl font-semibold w-16 absolute left-5 top-5">
//         Uber
//       </h1>

//       <div className="h-screen w-screen ">
//         {/* image for temporarty use */}
//         <img
//           className="w-full h-full object-cover "
//           src="https://imgs.search.brave.com/P4IXHo6p3RqPlh1--9gU65H9RjYIU1gZc822sS_BXLI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/ODI2LzIxNy9zbWFs/bC9taW5pLWNpdHkt/d2l0aC1hLXRheGkt/dHJhbnNwb3J0YXRp/b24tYmFja2dyb3Vu/ZC0zZC1yZW5kZXJp/bmctcGhvdG8uanBn"
//           alt=""
//         />

//         <div className="bg-white absolute  w-full h-screen flex flex-col justify-end">
//           <div className="h-[30%] bg-white p-5 rounded-t-3xl relative">
//               <h5 className=" opacity-0" ref={panelCloseRef} onClick={() => {
//                 setPanelOpen(false);
//               }}>
//                 <i className="ri-arrow-down-wide-line absolute top-6 right-6 text-2xl"></i>
//               </h5>
//             <h4 className=" bottom-10 left-5 text-2xl font-semibold">
//               Find a trip
//             </h4>
//             <form
//               onSubmit={(e) => {
//                 submitHandler(e);
//               }}
//             >
//               <div className="line absolute h-16  w-1 top-[44%] left-10 bg-gray-800 rounded-full"></div>
//               <input
//                 className="bg-zinc-200 w-full  px-12 py-2 text-base rounded-lg mt-4"
//                 type="text"
//                 placeholder="Add a pick-up loaction"
//                 value={pickup}
//                 onChange={(e)=> {
//                   setPickup(e.target.value)
//                 }}
//                 onClick={() => {
//                   setPanelOpen(true);
//                 }}
//               />
//               <input
//                 className="bg-zinc-200 w-full  px-12 py-2 text-base rounded-lg mt-3"
//                 type="text"
//                 placeholder="Enter your destination"
//                 value={destination}
//                 onChange={(e)=> {
//                   setDestination(e.target.value)
//                 }}

//                 onClick={() => {
//                   setPanelOpen(true);
//                 }}
//               />
//             </form>
//           </div>

//           <div ref={panelRef} className="h-[70%] bg-white hidden">
//             <LocationSearchPanel />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RiderHome;






import React, { useRef, useState } from 'react'
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from '../components/VehiclePanel';


const RiderHome = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)

    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
    const vehiclePanelRef = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])


    useGSAP(function () {
        if (vehiclePanelOpen) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanelOpen])

    // useGSAP(function () {
    //     if (confirmRidePanel) {
    //         gsap.to(confirmRidePanelRef.current, {
    //             transform: 'translateY(0)'
    //         })
    //     } else {
    //         gsap.to(confirmRidePanelRef.current, {
    //             transform: 'translateY(100%)'
    //         })
    //     }
    // }, [confirmRidePanel])

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'
                 onClick={()=> {
                  setPanelOpen(false);
                   setVehiclePanelOpen(false);
                 }}>
                {/* image for temporary use  */}
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-15 w-1 top-[50%] left-10 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                            }}
                            value={pickup}
                            onChange={(e) => {
                                setPickup(e.target.value)
                            }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                            }}
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value)
                            }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanelOpen={setVehiclePanelOpen} />
                </div>
            </div>
             <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel  setVehiclePanelOpen={setVehiclePanelOpen} />    
                {/* setConfirmRidePanel={setConfirmRidePanel} */}
            </div>
            {/* <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide />
            </div>  */}
        </div>
    )
}

export default RiderHome;