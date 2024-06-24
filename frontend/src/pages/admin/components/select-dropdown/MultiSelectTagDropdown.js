import AsyncSelect from "react-select/async";

const MultiSelectTagDropdown = ({
  defaultValue = [],
  loadOptions,
  onChange,
}) => {
  return (
    <div className="relative z-30">
      <AsyncSelect
        defaultValue={defaultValue}
        defaultOptions={true}
        isMulti={true}
        loadOptions={loadOptions}
        cacheOptions
        className="relative z-20"
        onChange={onChange}
      />
    </div>
  );
};
export default MultiSelectTagDropdown;
