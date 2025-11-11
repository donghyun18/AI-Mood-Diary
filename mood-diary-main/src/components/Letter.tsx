interface LetterProps {
  letterData: string;
  isLoading: boolean;
}

export default function Letter({ letterData, isLoading }: LetterProps) {
  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center dark:text-lineLight dark:brightness-75 text-lineDark brightness-125">
          Your reply is on the way📮 Please wait a moment!
        </div>
      ) : (
        <div className="dark:text-lineLight dark:brightness-75 text-lineDark brightness-125">
          {letterData}
        </div>
      )}
    </>
  );
}

