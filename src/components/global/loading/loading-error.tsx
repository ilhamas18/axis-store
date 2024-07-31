import Loading from "./";
import { RiErrorWarningLine } from "react-icons/ri";

interface Waiting {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const LoadingError = ({ loading, error, children }: Waiting) => {
  return (
    <>
      <Loading loading={loading} />
      {error ? (
        <div className="bg-[#F3CED9] h-[58px] text-center mt-8 flex items-center justify-center font-Museo-Bold text-[#C40D42]">
          <RiErrorWarningLine size={20} className="mr-2" /> {error}
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingError;
