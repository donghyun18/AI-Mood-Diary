export enum ButtonType {
  DEFAULT = "DEFAULT",
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

type ButtonProps = {
  text: string;
  type: ButtonType;
  onClick: () => void;
  className?: string;
};

export default function Button({
  text,
  type,
  onClick,
  className,
}: ButtonProps) {
  const btnColor =
    type === ButtonType.DEFAULT
      ? "bg-btnLight dark:bg-btnDark dark:text-white"
      : type === ButtonType.POSITIVE
      ? "bg-green text-white"
      : type === ButtonType.NEGATIVE
      ? "bg-red text-white"
      : "";

  return (
    <button
      className={`${btnColor} ${className} rounded-md py-2 px-5 whitespace-nowrap`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  type: "DEFAULT",
};
