import { Component, State, h, Event, Listen } from '@stencil/core';
import { alertController } from '@ionic/core';
import { EventEmitter } from '@ionic/core/dist/types/stencil-public-runtime';
import {callProjects,callTasks} from "../../dbinteractions"

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})

export class AppHome {

	//STATE
	@State() auth : boolean = false
	@State() loginError : boolean = false
	@State() user : {
		name: string
		id: string
		email: string
	} = {name: "", id: "", email: ""}
	@State() errorMsg : string = ""
	@State() activeProject: {
		projectname: string 
		project_id: string
	} = {projectname: "", project_id: ""}
	@State() projects: Array<{
        projectname: string
        project_id: string
	}> = [{projectname: "", project_id: ""}]
	@State() tasks: Array<{
		taskname: string
		taskfinished: boolean
		task_id: string
	}> = [{taskname: "", taskfinished: false, task_id: ""}]
	@State() showBackdrop: boolean = false

	//EVENT
	@Event() onUserSet: EventEmitter;

	//LISTENS
	@Listen("onSubmitForm") 
	updateStateOnSubmitForm(e) {
		this.auth = e.detail.auth
		this.loginError = e.detail.loginError
		this.user = e.detail.user
		this.errorMsg = e.detail.errorMsg
		
		this.onUserSet.emit(this.user)    
		
		if(this.loginError) 
			this.presentLoginAlert()
	}

	@Listen("onUserSet") 
	async callProjectsFromUser (e) {
		const loginResult = await callProjects(e.detail)
        this.projects = loginResult!.data
        console.log(this.projects) 
	}

	@Listen("onSetActiveProject")
	async callTasksFromProject (e) {
		this.activeProject = e.detail
		const callResult = await callTasks(this.user, this.activeProject.project_id)     
		this.tasks = callResult!.data		
	}

	@Listen("onSaveNewProject")
	@Listen("onSaveProjectEmptyName")
	@Listen("onDeleteProject")	
	async rerenderProjects () {
		this.showBackdrop = true
		const loginResult = await callProjects(this.user)
		this.projects = loginResult!.data        
		this.showBackdrop = false
	}

	@Listen("onTaskEdit")	
	@Listen("onTaskDelete")	
	@Listen("onSaveNewTask")
	@Listen("onSaveTaskEmptyName")
	async rerenderTasks () {
		this.showBackdrop = true
		const callResult = await callTasks(this.user, this.activeProject.project_id)     
		this.tasks = callResult!.data 
		this.showBackdrop = false
	}

	//FUNCTIONS
	async presentLoginAlert() {
		const alert = await alertController.create({
		  header: 'Authentication error',		  
		  message: this.errorMsg,
		  buttons: [{text: "Okay", handler: () => {this.loginError = false; this.errorMsg=""}, role: 'cancel'}]
		});
	
		await alert.present();
	}

	logOut = () => {
		this.auth = false
		this.user = {name: "", id: "", email: ""}
		this.activeProject = {projectname: "", project_id: ""}
	}

	//RENDER
	render() {
		return [			
			<ion-header>
				<ion-toolbar color="primary">
					<ion-title slot="start"><h1>To-do list</h1></ion-title>
				</ion-toolbar>
				
				<app-backdrop></app-backdrop>
				

				{
				this.auth 
				?
				<ion-toolbar color="secondary">
				<ion-title size="small">Welcome {this.user.name}</ion-title>
					<ion-button 
						fill="clear" 
						color="light" 
						slot="end"
						onClick={() => this.logOut()}
					>
						<ion-icon name="log-out-outline"></ion-icon>
						Log out
					</ion-button>
				</ion-toolbar>
				:
				<ion-toolbar color="secondary">
					<ion-title size="small">Log in</ion-title>
				</ion-toolbar>
				}	

			</ion-header>
			,
			<ion-content>
			{
			//renders LOGIN 
			!this.auth &&
			
				<app-login-form
					loginError={this.loginError}
					errorMsg={this.errorMsg}
					auth={this.auth}
					user={this.user}
				/>			
			}
			
			{
			//renders DASHBOARD
			this.auth && this.activeProject.project_id === "" &&
				
				<app-dashboard 
					user={this.user}
					auth={this.auth}	
					projects={this.projects}				
				/>		
			}
			
			{
			//renders PROJECT DASHBOARD
			this.auth && this.activeProject.project_id !== "" &&
			<div>
				<ion-toolbar color="medium">
					<ion-title size="small">{this.activeProject.projectname}</ion-title>
						<ion-button 
							fill="clear" 
							color="light" 
							slot="end"
							size="small"
							onClick={() => {
								this.activeProject = {projectname: "", project_id: ""}
								this.tasks = [{taskname: "", taskfinished: false, task_id: ""}]
							}}
						>
						<ion-icon slot="start" icon="caret-back-outline" />
						To projects
					</ion-button>
				</ion-toolbar>
					
				<app-project-dashboard
					user={this.user}
					activeProject={this.activeProject}	
					tasks={this.tasks}
				/>
			</div>
			}
			
			
			</ion-content>
			
		]
	}
}

/*
@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <p>
          Welcome to the PWA Toolkit. You can use this starter to build entire apps with web components using Stencil and ionic/core! Check out the README for everything that comes
          in this starter out of the box and check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        <ion-button href="/profile/ionic" expand="block">
          Profile page
        </ion-button>
      </ion-content>,
    ];
  }
}
*/