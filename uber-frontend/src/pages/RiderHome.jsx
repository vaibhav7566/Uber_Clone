import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useDispatch } from "react-redux";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import Sidebar from "../components/SideBar";
import { getAddressSuggestions } from "../features/rider/riderAPI";
import {
  fetchFareData,
  setRideDestinationCoordinates,
  setRideDestination,
  setRideOriginCoordinates,
  setRideOrigin,
} from "../features/ride/rideSlice";
import { logout } from "../features/auth/authSlice";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { toast } from "react-toastify";



const RiderHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onEvent, offEvent } = useSocket();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState("pickup");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const [vehicleFound, setvehicleFound] = useState(false);
  const vehicleFoundRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const waitingForDriverRef = useRef(null);

  const [journey, setJourney] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [interactionMode, setInteractionMode] = useState("map");

  const showMapControls =
    !panelOpen &&
    !vehiclePanelOpen &&
    !confirmRidePanel &&
    !vehicleFound &&
    !waitingForDriver;

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  const canOpenVehiclePanel = pickup.trim() && destination.trim();

  useEffect(() => {
    if (!panelOpen) {
      setLocationSuggestions([]);
      setIsSuggestionsLoading(false);
      return;
    }

    const searchText =
      activeField === "pickup" ? pickup.trim() : destination.trim();

    if (searchText.length < 2) {
      setLocationSuggestions([]);
      setIsSuggestionsLoading(false);
      return;
    }

    let isCancelled = false;

    const timerId = setTimeout(async () => {
      try {
        setIsSuggestionsLoading(true);
        const response = await getAddressSuggestions(searchText);

        if (!isCancelled) {
          setLocationSuggestions(response.data?.data || []);
        }
      } catch {
        if (!isCancelled) {
          setLocationSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSuggestionsLoading(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [pickup, destination, activeField, panelOpen]);

  useEffect(() => {
    const handleJourneyAccepted = (journey) => {
      setvehicleFound(false);
      setWaitingForDriver(true);
      setJourney(journey);
      console.log("Received journey-accepted event with journey data:", journey);
    };

    const handleJourneyStarted = (journey) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { journey } });
    };

    const handleJourneyCancelled = () => {
      setJourney(null);
      setvehicleFound(false);
      setWaitingForDriver(false);
      toast.error("Journey cancelled by driver");
      navigate("/rider/home", { replace: true });
    };

    onEvent("journey-accepted", handleJourneyAccepted);
    onEvent("journey-started", handleJourneyStarted);
    onEvent("journey-cancelled", handleJourneyCancelled);

    return () => {
      offEvent("journey-accepted");
      offEvent("journey-started");
      offEvent("journey-cancelled");
    };
  }, [onEvent, offEvent, navigate]);

  const handleSuggestionSelect = (suggestion) => {
    const selectedAddress =
      suggestion?.description || suggestion?.mainText || "";
    const selectedCoordinates = suggestion?.coordinates
      ? {
          lat: suggestion.coordinates.lat,
          lng: suggestion.coordinates.lng,
        }
      : null;

    if (activeField === "pickup") {
      setPickup(selectedAddress);
      dispatch(setRideOriginCoordinates(selectedCoordinates));
      setActiveField("destination");
    } else {
      setDestination(selectedAddress);
      dispatch(setRideDestinationCoordinates(selectedCoordinates));
    }

    setLocationSuggestions([]);
  };

  const handleFindRideClick = () => {
    if (!canOpenVehiclePanel) {
      return;
    }

    const trimmedPickup = pickup.trim();
    const trimmedDestination = destination.trim();

    dispatch(setRideOrigin(trimmedPickup));
    dispatch(setRideDestination(trimmedDestination));
    dispatch(
      fetchFareData({ origin: trimmedPickup, destination: trimmedDestination }),
    );

    setPanelOpen(false);
    setVehiclePanelOpen(true);
  };

  const handleMapPickupUpdate = (address, coordinates) => {
    setPickup(address || "");
    dispatch(setRideOriginCoordinates(coordinates || null));
    setActiveField("destination");
  };

  const handleMapDestinationUpdate = (address, coordinates) => {
    setDestination(address || "");
    dispatch(setRideDestinationCoordinates(coordinates || null));
  };

  // it is used to open and close the location search panel
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "62%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen],
  );

  // it is used to open and close the vehicle panel
  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanelOpen],
  );

  // it is used to open and close the confirm ride panel
  useGSAP(
    function () {
      if (!confirmRidePanelRef.current) {
        return;
      }

      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel],
  );

  // it is used to open and close the looking for driver panel
  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound],
  );

  // it is used to open and close the waiting for driver panel
  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  return (
    <div className="h-screen relative overflow-hidden">
      {!panelOpen ? (
        <div className="fixed top-0 left-0 w-full z-40 px-5 pt-4 pb-2 flex items-center justify-between">
          <img
            className="w-16 h-auto block"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber"
          />

          <i
            onClick={() => setMenuOpen(true)}
            className="ri-menu-fill text-2xl cursor-pointer"
          ></i>

          <Sidebar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            onLogout={handleLogout}
          />
        </div>
      ) : null}

      <div
        className={`h-screen w-screen ${panelOpen ? "bg-white" : ""}`}
        onClick={() => {
          setInteractionMode("map");
          setPanelOpen(false);
          setVehiclePanelOpen(false);
        }}
      >
      <Map
        setPickup={handleMapPickupUpdate}
        setDestination={handleMapDestinationUpdate}
        showControls={showMapControls}
        interactionMode={interactionMode}
        setInteractionMode={setInteractionMode}
      />
      </div>

      {/* THis is the pickup and destination input container with location search panel means when we click on pickup and destination inpit fields then this container will open and also open the location search panel. */}
      {/* <div className="flex flex-col justify-end h-screen absolute top-0 w-full"> */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none">
        {/* // this is the pickup and destination input container */}
        {/* <div className="min-h-[33%] p-5 bg-white relative z-[3]"> */}
        <div
          className="min-h-[33%] p-5 bg-white relative z-3 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            setInteractionMode("input");
          }}
        >
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Where to?</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-15 w-1 top-[35%] left-10 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setInteractionMode("input");
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              onFocus={() => {
                setInteractionMode("input");
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => {
                setActiveField("pickup");
                setPickup(e.target.value);
                dispatch(setRideOriginCoordinates(null));
              }}
              className="bg-[#eee] px-11 py-2 text-base rounded-lg w-full mt-4"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setInteractionMode("input");
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onFocus={() => {
                setInteractionMode("input");
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) => {
                setActiveField("destination");
                setDestination(e.target.value);
                dispatch(setRideDestinationCoordinates(null));
              }}
              className="bg-[#eee] px-11 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />

            <button
              type="button"
              onClick={handleFindRideClick}
              disabled={!canOpenVehiclePanel}
              className={`w-full mt-5 py-2 mb-3 rounded-lg text-white font-semibold transition ${
                canOpenVehiclePanel
                  ? "bg-black hover:bg-zinc-800"
                  : "bg-zinc-400 cursor-not-allowed"
              }`}
            >
              Find Ride
            </button>
          </form>
        </div>

        {/* // this is the location search panel */}
        <div
          ref={panelRef}
          className="bg-white h-0 overflow-y-auto pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            setInteractionMode("input");
          }}
        >
          <LocationSearchPanel
            // setPanelOpen={setPanelOpen}
            // setVehiclePanelOpen={setVehiclePanelOpen}
            suggestions={locationSuggestions}
            loading={isSuggestionsLoading}
            onSelectSuggestion={handleSuggestionSelect}
            onInteract={() => setInteractionMode("input")}
          />
        </div>
      </div>

      {/* // this is the vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      {/* // this is the confirm ride panel */}
      {confirmRidePanel ? (
        <div
          ref={confirmRidePanelRef}
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
        >
          <ConfirmRide
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setvehicleFound={setvehicleFound}
            pickupLocation={pickup}
            destinationLocation={destination}
          />
        </div>
      ) : null}

      {/* // this is the looking for driver panel */}
      <div
        ref={vehicleFoundRef}
        className={`fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 ${vehicleFound ? "visible" : "invisible"}`}
      >
        <LookingForDriver
          setvehicleFound={setvehicleFound}
          pickupLocation={pickup}
          destinationLocation={destination}
        />
      </div>

      {/* // this is the waiting for driver panel */}
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          journey={journey}
          setvehicleFound={setvehicleFound}
          waitingForDriver={waitingForDriver}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default RiderHome;
