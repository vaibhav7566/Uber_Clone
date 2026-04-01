import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedVehicle } from "../features/ride/rideSlice";

const VEHICLE_OPTIONS = [
  {
    type: "CAR",
    title: "UberGo",
    capacity: 4,
    etaText: "2 mins away",
    description: "Affordable, compact rides",
    image:
      "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    fallbackFare: 193.2,
  },
  {
    type: "BIKE",
    title: "Moto",
    capacity: 1,
    etaText: "3 mins away",
    description: "Affordable motorcycle rides",
    image:
      "https://imgs.search.brave.com/vKaXWDgr-kvl59nCEajWGwf4VDH7KTWau9QEsIbzAoY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jbi1n/ZW8xLnViZXIuY29t/L2ltYWdlLXByb2Mv/Y3JvcC9yZXNpemVj/cm9wL3VkYW0vZm9y/bWF0PWF1dG8vd2lk/dGg9NTUyL2hlaWdo/dD0zNjgvc3JjYjY0/PWFIUjBjSE02THk5/MFlpMXpkR0YwYVdN/dWRXSmxjaTVqYjIw/dmNISnZaQzkxWkdG/dExXRnpjMlYwY3k4/NU5UTTROVEV5WkMx/bVpHVXhMVFJtTnpN/dFltUTFNUzA1WTJW/bVpqUmxNalUwWmpF/dWNHNW4",
    fallbackFare: 65,
  },
  {
    type: "AUTO",
    title: "UberAuto",
    capacity: 3,
    etaText: "3 mins away",
    description: "Affordable Auto rides",
    image:
      "https://static.vecteezy.com/system/resources/previews/035/175/313/non_2x/thailand-car-isolated-on-background-3d-rendering-illustration-free-png.png",
    fallbackFare: 118.86,
  },
];

const VehiclePanel = (props) => {
  const dispatch = useDispatch();
  const { fareData, fareStatus, fareError, selectedVehicle } = useSelector(
    (state) => state.ride,
  );

  const fares = Array.isArray(fareData?.fares) ? fareData.fares : [];

  const getFareByType = (vehicleType) => {
    return fares.find((item) => item.vehicleType === vehicleType);
  };

  const handleSelectVehicle = (option) => {
    const fareQuote = getFareByType(option.type);
    const totalFare = fareQuote?.breakdown?.total ?? option.fallbackFare;
    const fallbackDistanceKm = Number(
      ((fareData?.distance?.value ?? 0) / 1000).toFixed(2),
    );
    const fallbackDurationMin = Number(
      ((fareData?.duration?.value ?? 0) / 60).toFixed(2),
    );

    dispatch(
      setSelectedVehicle({
        vehicleType: option.type,
        title: option.title,
        capacity: option.capacity,
        image: option.image,
        distance: fareQuote?.distance ?? fareData?.distance?.text ?? "",
        duration: fareQuote?.duration ?? fareData?.duration?.text ?? option.etaText,
        distanceKm: fareQuote?.distanceKm ?? fallbackDistanceKm,
        durationMin: fareQuote?.durationMin ?? fallbackDurationMin,
        estimatedFare: totalFare,
        breakdown: {
          ...(fareQuote?.breakdown || {}),
          total: totalFare,
        },
      }),
    );

    props.setConfirmRidePanel(true);
  };

  const cards = VEHICLE_OPTIONS.map((option) => {
    const fareQuote = getFareByType(option.type);
    const totalFare = fareQuote?.breakdown?.total ?? option.fallbackFare;

    return {
      ...option,
      fareQuote,
      totalFare,
      isSelected: selectedVehicle?.vehicleType === option.type,
      durationText: fareQuote?.duration || option.etaText,
    };
  });

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setVehiclePanelOpen(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>

      {fareStatus === "loading" ? (
        <div className="mb-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
          Loading latest fares...
        </div>
      ) : null}

      {fareStatus === "failed" ? (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {fareError?.message || fareError || "Failed to load latest fares"}
        </div>
      ) : null}

      {cards.map((card) => (
        <div
          key={card.type}
          onClick={() => {
            handleSelectVehicle(card);
          }}
          className={`flex border-2 mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer ${
            card.isSelected
              ? "border-zinc-900 bg-zinc-50"
              : "border-gray-300 active:border-zinc-800"
          }`}
        >
          <img className="h-10" src={card.image} alt={card.title} />
          <div className={card.type === "BIKE" ? "-ml-2 w-1/2" : "ml-2 w-1/2"}>
            <h4 className="font-medium text-base">
              {card.title}{" "}
              <span>
                <i className="ri-user-3-fill"></i>
                {card.capacity}
              </span>
            </h4>
            <h5 className="font-medium text-sm">{card.durationText}</h5>
            <p className="font-normal text-xs text-gray-600">{card.description}</p>
          </div>
          <h2 className="text-lg font-semibold">₹{Number(card.totalFare).toFixed(2)}</h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
