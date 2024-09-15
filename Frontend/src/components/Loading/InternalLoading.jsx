import ReactLoading from "react-loading";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export const InternalLoading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ReactLoading
        type={"spinningBubbles"}
        height="5%"
        width="5%"
        color={fullConfig.theme.colors.primary}
        className="flex justify-center items-center"
      />
    </div>
  );
};
