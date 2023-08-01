export default function input({
  name,
  type,
  onChange,
  require,
  min,
  id,
  placeholder,
  value,
  disabled,
  pattern,
  title,
}) {
  return (
    <input
      type={type}
      className=" focus:outline-quotee-200 px-5 py-2 rounded bg-quotee-100 placeholder:text-quotee-300"
      placeholder={placeholder}
      id={id}
      pattern={pattern}
      title={title}
      disabled={disabled}
      value={value}
      name={name ? name : ""}
      onChange={onChange}
      required={require}
      minLength={min ? min : ""}
    />
  );
}
