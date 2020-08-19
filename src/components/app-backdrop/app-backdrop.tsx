import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-backdrop',
  styleUrl: 'app-backdrop.css'
})

export class AppBackdrop {
    render() {
        return [
            
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
                   
        ]
    }
}