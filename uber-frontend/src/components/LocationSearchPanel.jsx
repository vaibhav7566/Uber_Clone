import React from "react";

const LocationSearchPanel = (props) => {
//  console.log(props);
 
  // sample array for location
  const locations = [
    "Awadhpuri Bhopal .hdsbhd vfn vv k vdj mdf",
    "Rampuri Bhopal .hdsbhd vfn vv k vdj mdf",
    "Janakpuri Bhopal .hdsbhd vfn vv k vdj mdf",
    "Indripuri Bhopal .hdsbhd vfn vv k vdj mdf",
  ]
  return (
    <div>
      {/* Dummy Data */}

    { locations.map((elem, index) => {
        return <div key={index} onClick={()=> {
          props.setVehiclePanelOpen(true);
          props.setPanelOpen(false);
          
        }}
         className="flex items-center justify-start gap-4 my-3 border-gray-200 active:border-gray-700 border-2  rounded-xl px-3 py-1 ">
        <h2>
          <i className=" bg-[#eee] h-8 w-8 rounded-full flex items-center justify-center ri-map-pin-fill"></i>
        </h2>
        <h4 className="font-medium">
         {elem}
        </h4>
      </div>
    })
    }

      

      
    </div>
  );
};

export default LocationSearchPanel;
