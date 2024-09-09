import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/40 flex z-10">
      <div className="m-auto">
        <ReactLoading type={"spinningBubbles"} height={50} width={50} />
      </div>
    </div>
  );
};

export default Loading;
