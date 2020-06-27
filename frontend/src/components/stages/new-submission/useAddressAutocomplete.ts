import React, { useEffect } from "react";
import { loadGoogleMaps } from "../../../services/webApi.service";

export interface AutocompleteRes {
  address: string;
  city_name: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

export function useAddressAutocomplete(args: {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange(autocomplete: AutocompleteRes): void;
}) {
  async function applyAutocomplete() {
    await loadGoogleMaps();
    if (!args.inputRef.current) return;
    let input = args.inputRef.current;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "il" },
    });
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
    // address check callback
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      // Find city
      if (!place.address_components) return console.error("invalid location");
      let cityName: string = getCityName(place);
      const lat = place.geometry?.location.lat();
      const lng = place.geometry?.location.lng();

      if (!lat) {
        throw new Error("Can't find lat");
      }

      if (!lng) {
        throw new Error("Can't find lng");
      }

      let parsedLocation: AutocompleteRes = {
        address: getFullAddressName(place),
        city_name: cityName,
        geometry: {
          lat,
          lng,
        },
      };
      args.onChange(parsedLocation);
    });
  }

  useEffect(() => {
    applyAutocomplete();
  }, []);
}

const getFullAddressName = (place: any) => {
  let fullName = [
    (place.address_components[0] && place.address_components[0].short_name) ||
      "",
    (place.address_components[1] && place.address_components[1].short_name) ||
      "",
    (place.address_components[2] && place.address_components[2].short_name) ||
      "",
  ].join(" ");
  return fullName;
};

const getCityName = (place: any) => {
  for (let i = 0; i < place.address_components.length; i++) {
    if (place.address_components[i].types.indexOf("locality") !== -1) {
      return place.address_components[i].long_name;
    }
  }
};
