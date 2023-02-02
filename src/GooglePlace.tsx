import { EnvironmentOutlined } from "@ant-design/icons";
// import { Icon } from "@commons";
import { Select } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

interface GooglePlaceProps {
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;

  placeId?: string;
  suggestion?: google.maps.places.AutocompletePrediction;
  address?: string;

  allowClear?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  onChange?: (data: GooglePlaceSelection) => void;
  onLoading?: (loading: boolean) => void;
}

export interface GooglePlaceSelection {
  placeId: string;
  suggestion: google.maps.places.AutocompletePrediction | undefined;
  details: PlaceData;
}

const GoogleGetPlace: React.FC<GooglePlaceProps> = (props) => {
  const { style, className, placeholder } = props;

  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState<string | undefined>(props.placeId);
  const [suggestion, setSuggestion] =
    useState<google.maps.places.AutocompletePrediction>();

  const place = usePlacesAutocomplete({
    requestOptions: {
      // @ts-ignore
      strictBounds: false,
      // types: ["address"],
      componentRestrictions: { country: "MY" },
    },
    debounce: 300,
    cache: 10,
  });

  const suggestions = place.suggestions.data || [];

  useEffect(() => {
    if (props.placeId) {
      getPlaceDetails(props.placeId, true);
    }
  }, []);

  useEffect(() => {
    if (placeId && placeId !== props.placeId) onPlaceChanged(placeId);
  }, [placeId]);

  useEffect(() => {
    props.onLoading?.(loading);
  }, [loading]);

  useEffect(() => {
    if (placeId && !suggestion && suggestions.length > 0) {
      if (placeId === suggestions[0].place_id) {
        setPlaceId(suggestions[0].place_id);
        setSuggestion(suggestions[0]);
        onPlaceChanged(suggestions[0].place_id);
      }
    }
  }, [suggestions]);

  //NOTE: navigator.permissions is not supported in safari and edge
  // const getCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     setLoading(true);
  //     navigator.geolocation.getCurrentPosition(async position => {
  //       const geocode = await getGeocode({ location: { lat: position.coords.latitude, lng: position.coords.longitude } });
  //       if (geocode && geocode.length > 0) {
  //         const placeId = geocode[0].place_id;
  //
  //         await getPlaceDetails(placeId, true);
  //         setPlaceId(placeId);
  //         setSuggestion(undefined);
  //         setTimeout(() => {
  //           setLoading(false);
  //         }, 350);
  //       } else {
  //         setLoading(false);
  //       }
  //     });
  //   }
  // };

  const getPlaceDetails = async (
    placeId: string,
    setPlaceValue?: boolean
  ): Promise<PlaceData> => {
    setLoading(true);
    try {
      const details = await getDetails({ placeId });
      if (!_.isString(details)) {
        if (setPlaceValue && details.formatted_address) {
          place.setValue(`"${details.formatted_address}"`, true);
        }
        const coordinates = {
          lat: details.geometry?.location?.lat(),
          lng: details.geometry?.location?.lng(),
        };
        return Promise.resolve({ ...details, coordinates });
      }
      setLoading(false);
      return Promise.reject();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const onPlaceChanged = async (placeId: string, setPlaceValue?: boolean) => {
    if (placeId) {
      const details = await getPlaceDetails(placeId, setPlaceValue);
      props.onChange?.({ placeId, suggestion, details });
    }
  };

  if (placeId && placeId === props.placeId && props.suggestion) {
    const found = _.find(suggestions, (s) => s.place_id === placeId);
    if (!found) suggestions.unshift(props.suggestion);
  }

  return (
    <Select
      suffixIcon={<Icon name="chevron-down" />}
      style={style}
      className={className}
      placeholder={placeholder}
      // size="large"
      bordered={props.bordered}
      showSearch
      defaultValue={props.address}
      //disabled={loading || props.disabled}
      allowClear={props.allowClear}
      onSearch={place.setValue}
      notFoundContent={place.suggestions.loading ? "" : null}
      filterOption={false}
      value={suggestions.length <= 0 ? undefined : placeId}
      // suffixIcon={
      //   loading ? (
      //     <LoadingOutlined />
      //   ) : (
      //     <AimOutlined className="text-base relative text-gray-600 bg-gray-100 rounded-full p-1 hover:shadow" onClick={getCurrentLocation} />
      //   )
      // }
      onChange={(value) => {
        if (!value) {
          setPlaceId(undefined);
          setSuggestion(undefined);
        } else {
          const suggestion = _.find(suggestions, (s) => s.place_id === value);
          if (suggestions) {
            setPlaceId(value);
            setSuggestion(suggestion);
          }
        }
      }}
    >
      {_.map(suggestions, (suggestion) => {
        const mainText = _.get(suggestion, "structured_formatting.main_text");
        const subText = _.get(
          suggestion,
          "structured_formatting.secondary_text"
        );
        const substr =
          _.get(
            suggestion,
            "structured_formatting.main_text_matched_substrings[0]"
          ) || "";
        const main = mainText.substring(substr?.offset, substr?.length);
        let prefix = "";

        if (substr?.offset > 0) prefix = mainText.substring(0, substr.offset);
        const postfix = mainText.substring(substr.length, mainText.length);
        return (
          <Select.Option
            className=""
            key={suggestion.place_id}
            value={suggestion.place_id}
          >
            <span className="flex items-center">
              <EnvironmentOutlined className="mr-2  text-sm" />
              <span className="truncate">
                {prefix}
                <span className="font-semibold">{main}</span>
                {postfix}
                <span className="ml-2 text-sm text-gray-500">{subText}</span>
              </span>
            </span>
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default GoogleGetPlace;
