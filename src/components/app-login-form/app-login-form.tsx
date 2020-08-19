import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import {logIn} from "../../dbinteractions"
import { AxiosResponse } from 'axios';

@Component({
  tag: "app-login-form",
  styleUrl: "app-login-form.css"
})

export class AppLoginForm {

    //STATE
    @State() userFields: 
    {
        email: string
        password: string
    } = {email: "fernito@gmail.com", password: ""};

       
    //PROPS
    @Prop() auth: boolean;
	@Prop() loginError: boolean;
    @Prop() user: 
    {
		name: string
		id: string
		email: string
	};
    @Prop() errorMsg: string; 

    //EVENT
    @Event() onSubmitForm: EventEmitter;

    //FUNCTIONS
    handleChange(e, field) {
        this.userFields = {
            ...this.userFields, 
            [field]: e.detail.value
        }
    }    

    handleSubmit = async e => {
        e.preventDefault()
        const loginResult: AxiosResponse | undefined = await logIn({
            email: this.userFields.email, 
            password: this.userFields.password
        })
       
        const onSubmitFormData = {
            errorMsg: loginResult!.data.msg,
            loginError: !loginResult!.data.auth,
            auth: loginResult!.data.auth,
            user: 
            {
                name: loginResult!.data.user_name,
                id: loginResult!.data.user_id,
                email: this.userFields.email,
            }
        }            
        this.onSubmitForm.emit(onSubmitFormData)        
    }

   
    //RENDER
    render() {
      
        return (
            
                <form onSubmit={e => this.handleSubmit(e)}>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-item>
                                    <ion-label position="floating">User email</ion-label>
                                    <ion-input 
                                        type="email"
                                        value={this.userFields["email"]}
                                        onIonChange={e => this.handleChange(e, "email")}
                                    ></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-item>
                                    <ion-label position="floating">Password</ion-label>
                                    <ion-input 
                                        type="password"
                                        value={this.userFields["password"]}
                                        onIonChange={e => this.handleChange(e, "password")}
                                    ></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col class="ion-text-center">
                                <ion-button 
                                    type="submit"
                                    disabled={this.userFields.password === "" || this.userFields.email === ""}
                                >
                                    Log in                                    
                                </ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>				
                </form>
		    
        )
    }

}