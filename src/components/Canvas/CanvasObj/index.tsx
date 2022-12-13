import { useDraggable, DraggableObj } from "../hooks/useDraggable";
import "./index.scss";
type prop = {
  ele: DraggableObj;
  reset_active: Function;
};
function CanvasObj(props: prop) {
  const draggable = useDraggable(props.ele);

  return (
    <div>
      <div ref={draggable.ref} style={draggable.style}>
        <p>drag me</p>
        <p>
          {`x: ${draggable.position.x.toFixed(0)}`}
          {`y: ${draggable.position.y.toFixed(0)}`}
        </p>
      </div>
    </div>
  );
}

export default CanvasObj;
