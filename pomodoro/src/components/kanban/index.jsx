import './kanban.scss'
import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { listData } from "../../listData.js";
import Timer from "../timer/index"
import Card from "../card";
import { v4 as uuidv4 } from "uuid";
const Kanban = () => {
    const [data, setData] = useState(listData)
    const [task, setTask] = useState('')
    const onDragEnd = result => {
        if (!result.destination) return
        const { source, destination } = result

        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
            const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)

            const sourceCol = data[sourceColIndex]
            const destinationCol = data[destinationColIndex]

            const sourceTask = [...sourceCol.tasks]
            const destinationTask = [...destinationCol.tasks]

            const [removed] = sourceTask.splice(source.index, 1)
            destinationTask.splice(destination.index, 0, removed)

            data[sourceColIndex].tasks = sourceTask
            data[destinationColIndex].tasks = destinationTask

            setData(data)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // setTask(event.target.nameTask.value);
        console.log('task creado ->', task);
        console.log(listData);
        listData[0].tasks.push({
            id: uuidv4(),
            title: task,
            done: false,
        })
        setData(listData); //se agregan los datos
        console.log(listData);
    }

    const handleChange = (event) => {
        setTask(event.target.value);
        console.log(task);
    }

    const deleteTask = (xd) => {
        console.log(xd)
        alert(xd)
    }

    // const reload = () =>{
        useEffect(() => {
            return ()=>console.log('tasks changed...');
        }, [data])
    // }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban">
                    {
                        data.map(section => (
                            <Droppable
                                key={section.id}
                                droppableId={section.id}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {section.title}
                                        </div>
                                        <div className="kanban__section__content">
                                            {
                                                section.tasks.map((task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    opacity: snapshot.isDragging ? '0.5' : '1'
                                                                }}
                                                            >
                                                                <span className='done'
                                                                    onClick={() => {
                                                                        data[2].tasks = data[2].tasks.filter(
                                                                            x => x.title !== task.title                                                                            
                                                                        )                                                                        
                                                                        console.log('deleted ->', task)                                                                        
                                                                        setData(data);
                                                                        console.log('data->', data)                                                                        
                                                                    }}
                                                                >✅</span>
                                                                {/* : "❌" */}
                                                                <Card>
                                                                    {task.title}
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))
                    }
                    <Timer />
                </div>
            </DragDropContext>

            <form className="form"
                onSubmit={handleSubmit}
                onChange={handleChange}
            >
                <label name="name">name task</label>
                <input name="nameTask" type={"text"} placeholder={'name task'} />
                <button type={'submit'}>create task</button>
            </form>
        </div>
    )
}

export default Kanban