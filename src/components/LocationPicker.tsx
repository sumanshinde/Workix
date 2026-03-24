'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { locationAPI } from '@/services/api';

const libraries: "places"[] = ["places"];

const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Default: Mumbai

export default function LocationPicker() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load user's saved location
  useEffect(() => {
    const fetchSavedLocation = async () => {
      try {
        const data = await locationAPI.get();
        if (data && data.lat && data.lng) {
          const loc = { lat: data.lat, lng: data.lng };
          setCenter(loc);
          setMarkerPosition(loc);
          if (data.address) setAddress(data.address);
        }
      } catch (err) {
        console.warn("No previous location found or error fetching");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedLocation();
  }, []);

  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmountMap = useCallback(() => {
    mapRef.current = null;
  }, []);

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setAddress(place.formatted_address || place.name || '');
      }
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  };

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          reverseGeocode(lat, lng);
        },
        () => alert('Geolocation failed or permission denied.')
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await locationAPI.save({
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        address: address,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl">
        <MapPin className="mx-auto text-red-500 mb-3" size={32} />
        <h3 className="font-bold text-slate-800">Map Loading Error</h3>
        <p className="text-sm text-slate-500 mt-1">Please ensure your environment variables are correctly configured.</p>
      </div>
    );
  }

  if (loading || !isLoaded) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
        <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
        <p className="text-sm text-slate-500 font-medium">Loading Map Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
      {/* Header Area */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="text-blue-600" size={20} />
          Business Location
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Set your primary location. This helps us match you with nearby leads.
        </p>

        {/* Input & Address Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search your city or exact address..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Autocomplete>
            <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
          <button
            onClick={detectCurrentLocation}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all whitespace-nowrap"
          >
            <Navigation size={18} />
            <span className="hidden sm:inline">Locate Me</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[350px] w-full bg-slate-50 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={13}
          onClick={onMapClick}
          onLoad={onLoadMap}
          onUnmount={onUnmountMap}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            animation={window.google.maps.Animation.DROP}
          />
        </GoogleMap>
      </div>

      {/* Footer Area */}
      <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <div className="font-bold text-slate-800">Selected Coordinates</div>
          <div className="text-slate-500 font-mono text-xs mt-1">
            Lat: {markerPosition.lat.toFixed(6)}, Lng: {markerPosition.lng.toFixed(6)}
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg min-w-[160px] justify-center ${
            success 
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/20'
          }`}
        >
          {saving ? (
            <><Loader2 size={18} className="animate-spin" /> Saving...</>
          ) : success ? (
            <><CheckCircle2 size={18} /> Saved!</>
          ) : (
            <><Save size={18} /> Save Location</>
          )}
        </button>
      </div>
    </div>
  );
}
