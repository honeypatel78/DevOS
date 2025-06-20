import { Routes } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreatePostComponent } from './components/post-editor/create-post/create-post.component';
import { EditPostComponent } from './components/post-editor/edit-post/edit-post.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { HelpSectionComponent } from './components/help-section/help-section.component';
import { DisplayComponent } from './components/user-profile/display/display.component';
import { AccountComponent } from './components/user-profile/account/account.component';
import { PostedPostComponent } from './components/file-explorer/posted-post/posted-post.component';
import { DraftsComponent } from './components/file-explorer/drafts/drafts.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { EditDraftComponent } from './components/post-editor/edit-draft/edit-draft.component';
import { RecycleBinComponent } from './components/recycle-bin/recycle-bin.component';

export const routes: Routes = [
 {
   path: '',
   component: LoginComponent,
 },
 {
   path: 'login',
   component: LoginComponent,
 },
 {
   path:'desktop',
   component: DesktopComponent,
   canActivate: [AuthGuard],
   children:[
      {  path: '', component: HomeScreenComponent},
      {  path: 'home', component: HomeScreenComponent},
      {  path: 'recyclebin', component: RecycleBinComponent},
      {  path: 'posts', component: PostComponent},
      {  path: 'profile', component: UserProfileComponent,
         children: [
            { path:'', component: AccountComponent},
            { path: 'display', component: DisplayComponent },
            { path: 'account', component: AccountComponent }]},
      { path: 'help', component: HelpSectionComponent},
      { path: 'files', component: FileExplorerComponent,
        children: [
            { path:'', component: PostedPostComponent},
            { path: 'posted', component: PostedPostComponent },
            { path: 'draft', component: DraftsComponent }]},
      { path: 'post-editor', component: PostEditorComponent,
        children: [
            { path:'', component: CreatePostComponent},
            { path: 'create', component: CreatePostComponent },
            { path: 'edit/:id', component: EditPostComponent },
            { path: 'draft/:id', component: EditDraftComponent }
         ]
      }]
 }
 
];
