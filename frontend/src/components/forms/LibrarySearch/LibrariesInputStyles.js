const style = {
    control: (provided, state) => ({
        ...provided,
        outline: "none",
        padding: "6px",
        boxShadow: state.isFocused ? "rgba(50, 50, 93, 0.20) 0px 2px 3px -1px, rgba(0, 0, 0, 0.25) 0px 1px 3px -1px" : "none",
        border: state.isFocused ? "1px solid #4429E9" : "1px solid #919EAB",
        '&:hover': {
            borderColor: "#4429E9",
        },
        cursor: "pointer",
        backgroundColor: state.isDisabled ? "#F4F6F9" : "white",
        fontSize: "3.6rem"
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: "16px",
        backgroundColor: state.isSelected ? "#4429E9" : "white",
    }),
    singleValue: (provided, state) => ({
        ...provided,
    }),
    loadingIndicator: (provided) => ({
        ...provided,
        color: "#4429E9",
      }),
};

export default style;