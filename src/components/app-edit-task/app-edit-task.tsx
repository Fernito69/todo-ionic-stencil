import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import {editAndSaveTask} from "../../dbinteractions"

@Component({
    tag: "app-edit-task",
    styleUrl: "app-edit-task.css"
})

export class AppEditTask {

    //PROPS
    @Prop() editTask:
    {
        taskname: string
        task_id: string
        taskfinished: boolean
    }
    @Prop() project_id: string

    //EVENTS
    @Event() onResetEditTask: EventEmitter;
    @Event() onSaveTaskEmptyName: EventEmitter;

    //FUNCTIONS
    resetEditTask() {
        this.editTask = {taskname: "", task_id: "", taskfinished: false}
        this.onResetEditTask.emit(this.editTask)  
    }

    saveTask = async () => {
        //ADD VALIDATION (no "")
        if (this.editTask.taskname === "") {
            //cancels edition
            this.resetEditTask()
            this.onSaveTaskEmptyName.emit()  
            return
        }
        
        //create new object with project id
        const finalObject = {
            _id: this.editTask.task_id,
            taskname: this.editTask.taskname,
            project_id: this.project_id,
            taskfinished: this.editTask.taskfinished
        }

        //DATABASE
        await editAndSaveTask(finalObject)

        //STATE TO ""
        this.resetEditTask()
    }

    render() {
        return [
            <ion-item>
                <ion-label position="floating">Project name</ion-label>
                <ion-input
                    autofocus
                    value={this.editTask.taskname}
                    onIonChange={e => {this.editTask.taskname = e.detail.value}}
                ></ion-input>
            </ion-item>
            ,
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button size="small" color="success" onClick={this.saveTask}>Save</ion-button>
                    </ion-col>
                    <ion-col>
                        <ion-button size="small" color="danger" onClick={() => this.editTask = {taskname: "", task_id: "", taskfinished: false}}>Cancel</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        ]
    }
}
