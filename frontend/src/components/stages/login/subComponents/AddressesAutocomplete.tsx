/* eslint-disable no-mixed-operators */
import React, { FC, useState } from "react";
import { FormInput } from "../../../core";
import { loadGoogleMaps } from "../../../../services/webApi.service";
import { useTranslation } from "react-i18next";
declare var google: any;

type AddressesAutocompleteProps = {
  locationChoosed(result: AutocompleteRes): void;
  handleChange: any;
  hasError: boolean;
  shallow?: boolean;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  value?: string;
};

export interface AutocompleteRes {
  address: string;
  city_name: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

let autocomplete: any;
export const AddressesAutocomplete: FC<AddressesAutocompleteProps> = ({
  locationChoosed,
  handleChange,
  hasError,
  shallow,
  required,
  inputRef,
  value,
}) => {
  const { t } = useTranslation();
  const [googleLoaded, setGoogleLoaded] = useState<boolean>(false);
  const initAutocompleteService = (): void => {
    // Load gmaps service
    loadGoogleMaps().then(() => {
      setGoogleLoaded(true);
      let input = document.getElementById("autocomplete-input");
      autocomplete = new google.maps.places.Autocomplete(input, {
        // types: ["address"], // for catch also Naharia
        // componentRestrictions: { country: "il" },
      });
      autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name",
      ]);
      // address check callback
      autocomplete.addListener("place_changed", (e: any) => {
        let place = autocomplete.getPlace();
        // Find city
        if (!place?.address_components) return console.error("invalid location");
        let cityName: string = getCityName(place);
        let parsedLocation: AutocompleteRes = {
          address: getFullAddressName(place),
          city_name: cityName,
          geometry: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        };
        locationChoosed(parsedLocation);
      });
    });
  };
  // Init autocomplete - prevent loading few times
  if (!googleLoaded) initAutocompleteService();

  return (
    <div className="addresses-autocomplete-container">
      <FormInput
        id="autocomplete-input"
        hasError={hasError}
        handleChange={handleChange}
        placeholder={t("רוטשילד 47, תל אביב")}
        name="address_str"
        title={t("כתובת מגורים")}
        shallow={shallow}
        required={required}
        inputRef={inputRef}
        value={value}
      />
    </div>
  );
};

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
