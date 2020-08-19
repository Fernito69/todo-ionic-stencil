import { Component, Prop, State, Listen, h } from '@stencil/core';

@Component({
    tag: "app-project-dashboard",
    styleUrl: "app-project-dashboard.css"
  })

export class AppProjectDashboard {

    //STATE
    @State() editTask: {
        taskname: string
        task_id: string
        taskfinished: boolean
    } = {taskname: "", task_id: "", taskfinished: false}
    @State() addTask: boolean = false

    //PROPS
    @Prop() user: 
    {
		name: string
		id: string
		email: string
    }
    @Prop() activeProject: 
    {
		projectname: string 
		project_id: string
    }
    @Prop() tasks: Array<{
		taskname: string
		taskfinished: boolean
		task_id: string
	}>

    //LISTENS
    //LISTENS
    @Listen("onResetAddTask")
    resetAddProject() {
        this.addTask = false
    }

    render() {
        return [
            <div class="ion-text-center ion-padding">
                {
                this.addTask
                ?
                <app-add-task
                    project_id={this.activeProject.project_id}                                       
                />
                :
                <div class="ion-text-center ion-padding">
                    <ion-text>
                        <h6>Click on each task to set it as "done" or "not done". Swipe left on them to see other options.</h6>
                    </ion-text>

                    <ion-button
                        onClick={() => this.addTask = true}
                    >
                        Add new task
                    </ion-button>
                </div>  
                }

                <div class="ion-text-center ion-padding">
                    <ion-list>
                        {
                            this.tasks.map(task => (
                                <app-task
                                    key={task.task_id}
                                    task={task}
                                    editTask={this.editTask}
                                    project_id={this.activeProject.project_id}                                    
                                />
                            ))
                        }
                    </ion-list>
                </div>

            </div>
        ]
    }
}