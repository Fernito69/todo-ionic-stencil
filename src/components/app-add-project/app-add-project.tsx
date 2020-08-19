import { Component, Prop, Event, EventEmitter, State, h } from '@stencil/core';
import {saveNewProject} from "../../dbinteractions"
import { alertController } from '@ionic/core';

@Component({
    tag: "app-add-project",
    styleUrl: "app-add-project.css"
})

export class AppAddProject {

    //PROPS
    @Prop() user_id: string

    //STATE
    @State() newProject: string = ""

    //EVENT
    @Event() onResetAddProject: EventEmitter
    @Event() onSaveNewProject: EventEmitter

    //FUNCTIONS
    async presentEmptyAlert() {
		const alert = await alertController.create({
		  header: 'Error',		  
		  message: "The project must have a name!",
		  buttons: [{text: "Okay", handler: () => {}, role: 'cancel'}]
		});
	
		await alert.present();
    }
    
    addNewProject = async () => {
        //ADD VALIDATION (no "")
        if (this.newProject === "") {
            this.presentEmptyAlert()
            return
        }
        
        //create new object with user id
        const finalObject = {
            projectname: this.newProject,
            user_id: this.user_id
        }

        //DATABASE
        await saveNewProject(finalObject)

        //STATE TO ""
        this.onResetAddProject.emit()
        this.onSaveNewProject.emit()
        this.newProject = ""
    }

    render() {
        return [
            <ion-item>
                <ion-label position="floating">Project name</ion-label>
                <ion-input
                    autofocus
                    value={this.newProject}
                    onIonChange={(e: CustomEvent) => this.newProject = e.detail.value}
                ></ion-input>
            </ion-item>,
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button size="small" color="success" onClick={this.addNewProject}>Save</ion-button>
                    </ion-col>
                    <ion-col>
                        <ion-button size="small" color="danger" onClick={() => this.onResetAddProject.emit()}>Cancel</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        ]
    }    
}