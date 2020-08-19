import { Component, Prop, Listen, Event, h, State } from '@stencil/core';
import { alertController } from '@ionic/core';
import {removeProject} from "../../dbinteractions"
import { EventEmitter } from '@ionic/core/dist/types/stencil-public-runtime';

@Component({
    tag: "app-project",
    styleUrl: "app-project.css"
})

export class AppProject {

    //STATE
    @State() confirmDelete: boolean = true

    //PROPS
    @Prop() user_id: string
    @Prop() project: {
        projectname: string
        project_id: string
    }
    @Prop() editProject: {
        projectname: string
        project_id: string
    }

    //EVENTS
    @Event() onDeleteProject: EventEmitter
    @Event() onSetActiveProject: EventEmitter

    //LISTEN
    @Listen("onResetEditProject") 
	updateStateOnSubmitForm(e) {
        this.editProject = e.detail
    }

    //FUNCTIONS:
    async presentProjectDeleteAlert() {
        const alert = await alertController.create({
            header: 'Delete project',		  
            message: `Are you sure you want to delete "${this.project.projectname}"? This action cannot be undone`,
            buttons: [
                {text: "Okay", handler: () => this.deleteProject()},
                {text: "Cancel", handler: () => {}, role: 'cancel'}
            ]
          });
      
          await alert.present();
    }

    deleteProject = async () => {
        await removeProject(this.project.project_id)
        this.onDeleteProject.emit()
    }


    render() {
        return [
            <div>
                {
                this.editProject.project_id === this.project.project_id
                ?
                <app-edit-project 
                    editProject={this.editProject}                    
                    user_id={this.user_id}
                />
                :
                <ion-item-sliding>
                    <ion-item onClick={() => this.onSetActiveProject.emit(this.project)}>
                        {this.project.projectname}
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option color="success" onClick={() => {this.editProject = this.project}}>
                            <ion-icon name="create-outline"></ion-icon>
                        </ion-item-option>
                        <ion-item-option color="danger" onClick={() => this.presentProjectDeleteAlert()}>
                        <ion-icon name="trash-outline"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
                }               
            </div>
        ]        
    }
}
