import { Component, Prop, Listen, Event, h, State } from '@stencil/core';
import {editAndSaveTask, removeTask} from "../../dbinteractions"
import { EventEmitter } from '@ionic/core/dist/types/stencil-public-runtime';
import { alertController } from '@ionic/core';

@Component({
    tag: "app-task",
    styleUrl: "app-task.css"
})

export class AppTask {

    @Prop() task: 
    {
		taskname: string
		taskfinished: boolean
		task_id: string
    }
    @Prop() editTask:
    {
        taskname: string
        task_id: string
        taskfinished: boolean
    }
    @Prop() project_id: string

    //EVENT
    @Event() onTaskEdit: EventEmitter
    @Event() onTaskDelete: EventEmitter

    //LISTEN
    @Listen("onResetEditTask") 
	updateStateOnSubmitForm(e) {
        this.editTask = e.detail
    }

    //FUNCTIONS
    setDone = async () => {

        const finalObject = {
            _id: this.task.task_id,
            taskname: this.task.taskname,
            project_id: this.project_id,
            taskfinished: !this.task.taskfinished
        }
        
        await editAndSaveTask(finalObject)

        this.onTaskEdit.emit()   
    }

    async presentTaskDeleteAlert() {
        const alert = await alertController.create({
            header: 'Delete task',		  
            message: `Are you sure you want to delete "${this.task.taskname}"? This action cannot be undone`,
            buttons: [
                {text: "Okay", handler: () => this.deleteTask()},
                {text: "Cancel", handler: () => {}, role: 'cancel'}
            ]
          });
      
          await alert.present();
    }

    deleteTask = async () => {
        await removeTask(this.task.task_id)
        this.onTaskDelete.emit()   
    }

    render() {
        return [
            this.editTask.task_id === this.task.task_id 
            ?
            <app-edit-task
                editTask={this.editTask}
                project_id={this.project_id}
            />
            :
            <ion-item-sliding>
                <ion-item>
                    <ion-text>{this.task.taskname}</ion-text>
                    {
                        this.task.taskfinished
                        ?
                        <ion-button 
                            slot="end" 
                            size="small" 
                            color="success" 
                            onClick={() => this.setDone()}
                        >Done</ion-button>
                        :
                        <ion-button 
                            slot="end" 
                            size="small" 
                            color="danger"
                            onClick={() => this.setDone()}
                        >Not done</ion-button>
                    }
                </ion-item>
                <ion-item-options side="end">
                    <ion-item-option color="success" onClick={() => this.editTask = this.task}>
                        <ion-icon icon="create-outline" />
                    </ion-item-option>
                    <ion-item-option color="danger" onClick={() => this.presentTaskDeleteAlert()}>
                        <ion-icon icon="trash-outline" />
                    </ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
        ]
    }
}
