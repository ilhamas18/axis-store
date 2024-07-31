import { TouchEventHandler } from "react";

interface type {
  id: string;
  type?: string;
  name?: string;
  center?: boolean;
  placeholder?: string;
  label?: string;
  max?: number;
  value?: string;
  anim?: boolean;
  errors?: any;
  change: any;
  hideCopy?: boolean;
  disabled?: boolean;
  variant?: string;
  onClick?: any;
}

const TextInput = ({
  id,
  type,
  name,
  center,
  placeholder,
  label,
  max,
  value,
  errors,
  change,
  hideCopy,
  disabled,
  variant,
  onClick,
}: type) => {
  return (
    <div className="form">
      <input
        type={type}
        onKeyPress={(event) => {
          if (type == "tel") {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }
        }}
        id={id}
        name={name}
        maxLength={max}
        value={value ?? ""}
        className={`${variant == "secondary" ? "form__input_secondary" : "form__input"} ${errors ? "error" : ""} ${
          center ? "center text-center tracking-widests font-Bold" : ""
        } ${type === "text-area" ? "h-[100px]" : ""}`}
        pattern="[a-zA-Z0-9.,\s]+"
        onInvalid={(e: any) => {
          if (type == "textarea") {
            e.target.setCustomValidity("Hanya dapat memasukan huruf dan angka");
          }
        }}
        placeholder={`${placeholder ? placeholder : " "}`}
        autoComplete="off"
        onPaste={(e: any) => {
          if (hideCopy) {
            e.preventDefault();
            return false;
          }
        }}
        onCopy={(e: any) => {
          if (hideCopy) {
            e.preventDefault();
            return false;
          }
        }}
        min={0}
        onWheel={(e: any) => {
          if (type == "number") {
            e.target.blur();
          }
        }}
        onChange={(event) => change(event.target.value)}
        disabled={disabled}
        onClick={onClick}
      />
      {label && (
        <label
          htmlFor={name}
          className={` ${type === "text-area" ? "form__label_textarea" : "form__label"}  ${
            errors ? "error" : ""
          } font-Museo-Light`}
        >
          {label}
        </label>
      )}
      {errors && <p className="text-xl-pink mt-1 text-sm">{errors}</p>}
    </div>
  );
};

export default TextInput;
