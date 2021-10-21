import { div } from "prelude-ls";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Div1 from "./Div1";
import Div2 from "./Div2";

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function App() {
  const listItems = getItems(10);
  const listSelected = getItems(5, 10);
  const [items, setItems] = useState(listItems);
  const [selected, setSelected] = useState(listSelected);
  const [list, setList] = useState();

  console.log("items", items);
  console.log("selected", selected);

  const id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  const getList = (id) => setList(id2List[id]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log("source", source);
    console.log("destination", destination);

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index);

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      setSelected([...selected, result.droppable2]);
      setItems([...items, result.droppable]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Draggable>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Div1 listItems={listItems} />
                </div>
              )}
            </Draggable>
          </div>
        )}
      </Droppable>
      <Droppable droppableId="droppable2">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Draggable>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Div2 listSelected={listSelected} />
                </div>
              )}
            </Draggable>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
