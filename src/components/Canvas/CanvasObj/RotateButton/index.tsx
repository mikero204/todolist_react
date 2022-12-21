import { useCustomDrag } from "../../hooks/useCustomDrag";
import { useEffect } from "react";
import styles from "./index.module.scss";
import rotate from "../../../../assets/img/rotate.png";
function RotateButton(ele: any) {
  const rotatedrag = useCustomDrag(ele);
  useEffect(() => {
    return () => {
      rotatedrag.disable();
    };
  }, []);

  return (
    <div
      ref={rotatedrag.ref}
      style={{
        touchAction: "none",
      }}
      className={styles.rotationhandle}
    >
      <img width={24 + "px"} height={24 + "px"} src={rotate} alt="" />
    </div>
  );
}
export default RotateButton;
