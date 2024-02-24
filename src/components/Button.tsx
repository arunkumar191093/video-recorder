type ButtonProps = {
  className?: string;
  buttonText?: string;
  handleClick: any;
  disabled?: boolean;
  children?: any;
}

export const Button = ({
  className = "",
  buttonText = "",
  handleClick = () => { },
  disabled = false,
  children
}: ButtonProps) => {
  return (
    <button
      className={`p-2 rounded-3xl mx-2 mt-2 border-1 bg-blue-600 text-white ${className} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      disabled={disabled}
      onClick={handleClick}>
      {children ?? buttonText}
    </button>
  )
}