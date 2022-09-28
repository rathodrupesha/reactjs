import "./FrontVideo.css";
const Video = () => {
  const src = "./cmspanel.mp4";

  return (
    <div>
      <video autoPlay muted loop id="myVideo">
        <source src={src} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};

export default Video;
