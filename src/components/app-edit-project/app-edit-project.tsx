import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import {editAndSaveProject} from "../../dbinteractions"

@Component({
    tag: "app-edit-project",
    styleUrl: "app-edit-project.css"
})

export class AppEditProject {

    //PROPS
    @Prop() editProject: {
        projectname: string
        project_id: string
    }
    @Prop() user_id: string

    //EVENTS
    @Event() onResetEditProject: EventEmitter;
    @Event() onSaveProjectEmptyName: EventEmitter;

    //FUNCTIONS
    resetEditProject() {
        this.editProject = {projectname: "", project_id: ""}
        this.onResetEditProject.emit(this.editProject)  
    }

    saveProject = async () => {
        //ADD VALIDATION (no "")
        if (this.editProject.projectname === "") {
            this.resetEditProject()
            this.onSaveProjectEmptyName.emit()  
            return
        }
        
        //create new object with user id
        const finalObject = {
            _id: this.editProject.project_id,
            projectname: this.editProject.projectname,
            user_id: this.user_id
        }

        console.log(finalObject)

        //DATABASE
        await editAndSaveProject(finalObject)

        //STATE TO ""
        this.resetEditProject()        
    }

    render() {
        return [
            <div>
                <ion-item>
                    <ion-label position="floating">Project name</ion-label>
                    <ion-input
                        autofocus
                        value={this.editProject.projectname}
                        onIonChange={e => {this.editProject.projectname = e.detail.value}}
                    ></ion-input>
                </ion-item>

                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button size="small" color="success" onClick={() => this.saveProject()}>Save</ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button size="small" color="danger" onClick={() => this.resetEditProject()}>Cancel</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        ]
    }
}