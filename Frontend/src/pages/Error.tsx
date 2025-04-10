import "../App.css";
import errorImg from "../static/error_small.png";

// Define props type
interface ErrorPageProps {
  message: string;
  onClose: () => void;
}

export default function ErrorPage({ message, onClose }: ErrorPageProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            X
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img src={errorImg} alt="Error" className="w-16 h-16 mb-4" />
          <h3 className="text-lg text-red-600 font-semibold">{message}</h3>
        </div>
      </div>
    </div>
  );
}
