import { Component, Prop, Event, EventEmitter, State, h } from '@stencil/core';
import {saveNewTask} from "../../dbinteractions"
import { alertController } from '@ionic/core';

@Component({
    tag: "app-add-task",
    styleUrl: "app-add-task.css"
})

export class AppAddTask {

    //PROPS
    @Prop() project_id: string

    //STATE
    @State() newTask: string = ""

    //EVENTS
    @Event() onResetAddTask: EventEmitter
    @Event() onSaveNewTask: EventEmitter

    //FUNCTIONS
    async presentEmptyTaskAlert() {
		const alert = await alertController.create({
		  header: 'Error',		  
		  message: "The task must have a name!",
		  buttons: [{text: "Okay", handler: () => {}, role: 'cancel'}]
		});
	
		await alert.present();
    }

    addNewTask = async () => {
        //ADD VALIDATION (no "")
        console.log("from ADD TASK")
        if (this.newTask === "") {
            this.presentEmptyTaskAlert()
            return
        }
        
        //create new object with user id
        const finalObject = {
            taskname: this.newTask,
            project_id: this.project_id
        }

        console.log(finalObject)

        //DATABASE
        await saveNewTask(finalObject)

        //STATE TO ""
        this.onResetAddTask.emit()
        this.onSaveNewTask.emit()
        this.newTask = ""
    }

    popo() {
        console.log("popo")
    }

    render() {
        return [
            <ion-item>
                <ion-label position="floating">Task name</ion-label>
                <ion-input
                    autofocus
                    value={this.newTask}
                    onIonChange={(e: CustomEvent) => this.newTask = e.detail.value}
                ></ion-input>
            </ion-item>
            ,
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button size="small" color="success" onClick={this.addNewTask}>Save</ion-button>
                    </ion-col>
                    <ion-col>
                        <ion-button size="small" color="danger" onClick={() => this.onResetAddTask.emit()}>Cancel</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>           
        ]
    }
}
