import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

import { AppComponent } from './app.component';
import { EmptyItemPlaceholderDirective } from './empty-item-placeholder.directive';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        EmptyItemPlaceholderDirective
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        TreeViewModule,
        FormsModule
    ]
})
export class AppModule { }

