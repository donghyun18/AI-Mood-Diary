type HeaderProps = {
  title: string;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
};

export default function Header({ title, leftChild, rightChild }: HeaderProps) {
  return (
    <header className="flex items-center py-5 border-b border-lineLight dark:border-lineDark ">
      <div className="flex w-1/4 justify-start">{leftChild}</div>
      <div className="flex w-1/2 justify-center text-lg font-semibold dark:text-white">
        {title}
      </div>
      <div className="flex w-1/4 justify-end">{rightChild}</div>
    </header>
  );
}
