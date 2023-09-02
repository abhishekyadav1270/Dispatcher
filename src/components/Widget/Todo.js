import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { } from '../../modules/actions';


const Todo = () => {
    const [todos, setTodo] = useState([
        { text: 'SUbscriber 1', id: '100001' },
        { text: 'SUbscriber 2', id: '200001' },
        { text: 'SUbscriber 3', id: '300001' },
        { text: 'SUbscriber 4', id: '400001' },
        { text: 'SUbscriber 5', id: '500001' },
        { text: 'SUbscriber 6', id: '600001' },
    ]);
    const [newTodo, setnewTodo] = useState("");
    useEffect(() => {
        //code here
        //handleData()
    }, [])
    //functions

    const AddTodo = () => {
        if(newTodo !== ""){
            todos.push({ text: newTodo, id: Math.random() });
            setnewTodo('')
        }
    }

    const deleteTodo = (d) => {
        const newTodo = todos.filter(todo => {
            if(todo.id !== d.id){
              return todo;
            }
          })
          setTodo(newTodo);
    }

    return (
        <div class="main-widg-grid">
            <div class="widg-header">
                <div class="title1"><p class="f-title-m white">To-Do</p></div> 
                <p class="f-text-10 all-caps ml-1 m-t-10" style={{ color: '#8A98AC' }}> Productivity management</p>
            </div>
            <div class="widg-body border-2 ovr-scr-y" style={{padding:'8px'}}>
                {todos.map((todo,id)=>{
                    return(
                        <div class="widg-grid-4 to-do-item m-b-4" key={id}>
                            <div class="widg-b41">
                                <input type="checkbox" class="m-l-4" />
                            </div>
                            <div class="widg-b42">
                                <span class="">{todo.text}</span>
                            </div>
                            <div class="widg-b43">
                                <i class="feather icon-x to-do-close" onClick={()=>deleteTodo(todo)}></i>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div class="widg-footer" >
                <div class="input-group mt-3" >
                    <input type="text" value={newTodo} onChange={(e)=>setnewTodo(e.target.value)} class="textinput searchinput-sq" v-model="newtodo" placeholder="Write your Todo's" aria-label="What do you need to do today?" aria-describedby="button-addon-to-do-list"/>
                    <div class="input-group-append" >
                        <button class="btnsearch-sq" onClick={AddTodo}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ train }) => {
    const { } = train;
    return {

    };
};

export default connect(mapStateToProps, {})(Todo);
