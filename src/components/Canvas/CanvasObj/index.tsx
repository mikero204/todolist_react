import { useDraggable } from "src/components/Canvas/hooks/useDraggable";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { CHANGE_ACTIVE, DELETE_OBJ, COPY_OBJ } from "../Constants";
import CanvasObjOutLineBox from "./CanvasObjOutLineBox";

function CanvasObj({ ele }: any) {
  const draggable = useDraggable(ele);
  const [state, dispatch] = useCanvasContext();
  const [showborder, setBorder] = useState(false);

  useEffect(() => {
    window.addEventListener("mousedown", (e: any) => {
      console.log(e.clientX, e.clientY);
    });
    return () => {
      draggable.disable();
    };
  }, []);
  const activeObj = (e: any) => {
    e.preventDefault();
    dispatch({ type: CHANGE_ACTIVE, payload: ele });
  };

  const {
    id,
    name,
    x,
    y,
    width,
    height,
    zindex,
    rotate,
    img,
    active,
    lock,
    color,
  } = ele;
  const obj_size = state.canvas_params.Canvas_obj_size;
  let style: any = {
    position: "absolute",
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
    width: width + "px",
    height: height + "px",
  };
  // if (showborder) {
  //   style.border = "2px solid #8b3dff";
  // }
  // if (ele.active) {
  //   style.border = "2px solid #8b3dff";
  // }
  // let h = (height - height*1.1)/2
  // let w = (width - width*1.1)
  // const outlinebox_transform ={
  //   x:,y:,width:,height:
  // }
  return (
    <>
      <div>
        {ele.active ? (
          <>
            <CanvasHoverToolBar ele={ele} />
          </>
        ) : null}
        {ele.active ? (
          <>
            <CanvasObjOutLineBox
              style={{
                position: "absolute",
                transform: `translate(${x - 6}px, ${
                  y - 6
                }px)  rotate(${rotate}deg) `,
                width: Number(width) + 12,
                height: Number(height) + 12,
              }}
              id={id}
              ele={ele}
              className={styles.box}
            />
          </>
        ) : null}
      </div>

      <div
        className={styles.box}
        ref={draggable.ref}
        style={style}
        onClick={activeObj}
        onTouchEnd={activeObj}
        onMouseMove={() => setBorder(true)}
        onMouseOut={() => setBorder(false)}
        data-id={id}
      >
        <span
          className={styles.img_drag}
          style={{
            display: "inlineBlock",
            background: `url(${ele.img})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundAttachment: "scroll",
          }}
        />
      </div>
    </>
  );
}

export default CanvasObj;
function CanvasHoverToolBar({ ele }: any) {
  const [state, dispatch] = useCanvasContext();

  const position = {
    top: ele.y - 40 + "px",
    left:
      ele.x +
      // state.canvas_params.innerCanvasWidth / 10 / 4 +
      ele.width / 3 +
      "px",
  };

  const copyObj = () => {
    dispatch({ type: COPY_OBJ, payload: { id: ele.id } });
  };
  const deleteObj = () => {
    dispatch({ type: DELETE_OBJ, payload: { id: ele.id } });
  };
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: state.canvas_params.innerCanvasWidth / 10 + "px",
        height: state.canvas_params.innerCanvasWidth / 10 / 2 + "px",
        boxShadow:
          "0 0 0 1px rgba(64,87,109,0.07),0 2px 12px rgba(53,71,90,0.2)",
        borderRadius: "10rem",
        ...position,
        // transform: transform,
      }}
    >
      <div
        onClick={copyObj}
        style={{ display: "flex", alignItems: "center", height: "30px" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 3h8a2 2 0 0 1 2 2v.5h-1.5V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.5V17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 5.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-8ZM19 7h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 11a.75.75 0 0 0-.75.75v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5A.75.75 0 0 0 15 11Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div
        onClick={deleteObj}
        style={{ display: "flex", alignItems: "center", height: "30px" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M8 5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3h4.25a.75.75 0 1 1 0 1.5H19V18a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6.5H3.75a.75.75 0 0 1 0-1.5H8zM6.5 6.5V18c0 .83.67 1.5 1.5 1.5h8c.83 0 1.5-.67 1.5-1.5V6.5h-11zm3-1.5h5c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5zm-.25 4h1.5v8h-1.5V9zm4 0h1.5v8h-1.5V9z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
