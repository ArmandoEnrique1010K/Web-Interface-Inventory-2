import style from "./blueLoader.module.css";

export const BlueLoader = () => {
  return (
    <div className="text-center py-4">
      <span className={style.loader}></span>
    </div>
  );
};
