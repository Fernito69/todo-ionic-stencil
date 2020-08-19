import { Component, Prop, State, Listen, h } from '@stencil/core';

@Component({
    tag: "app-dashboard",
    styleUrl: "app-dashboard.css"
  })

export class AppDashboard {
    
    //STATE    
    @State() editProject: 
    {
        projectname: string
        project_id: string
    } = {projectname: "", project_id: ""}
    @State() addProject: boolean = false
    @State() deletingProject: boolean = false

    //PROPS
    @Prop() user: 
    {
		name: string
		id: string
		email: string
    }
    @Prop() auth: boolean
    @Prop() projects: Array<{
        projectname: string
        project_id: string
    }>

    //LISTENS
    @Listen("onResetAddProject")
    resetAddProject() {
        this.addProject = false
    }

   
    //RENDER
	render() {
        return [
            <ion-content class="ion-text-center ion-padding">

                {
                this.addProject
                ?
                <app-add-project 
                    user_id={this.user.id}                    
                />
                :
                <div>
                    <ion-text>
                        <h6>Click on your projects to access them. Swipe left on them to see other options.</h6>
                    </ion-text>

                    <ion-button
                        onClick={() => this.addProject = true}
                    >
                        Add new project
                    </ion-button>
                </div>
                }

                <ion-list>
                    {
                        this.projects.map(project => (
                            <app-project
                                user_id={this.user.id}
                                key={project.project_id}
                                project={project}
                                editProject={this.editProject}                            
                            />
                        ))
                    }
                </ion-list>
            </ion-content>
        ]
    }
}

