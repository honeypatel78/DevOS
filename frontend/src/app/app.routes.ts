import { Routes } from '@angular/router';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { CreatePostComponent } from './components/post-editor/create-post/create-post.component';
import { EditPostComponent } from './components/post-editor/edit-post/edit-post.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { HelpSectionComponent } from './components/help-section/help-section.component';
import { PostedPostComponent } from './components/file-explorer/posted-post/posted-post.component';
import { DraftsComponent } from './components/file-explorer/drafts/drafts.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { EditDraftComponent } from './components/post-editor/edit-draft/edit-draft.component';
import { RecycleBinComponent } from './components/recycle-bin/recycle-bin.component';
import { ChromeComponent } from './components/chrome/chrome.component';
import { PostSectionComponent } from './components/chrome/post-section/post-section.component';
import { DevelopersComponent } from './components/chrome/developers/developers.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountComponent } from './components/settings/account/account.component';
import { DisplayComponent } from './components/settings/display/display.component';
import { DevlistComponent } from './components/file-explorer/devlist/devlist.component';
export const routes: Routes = [
 {
   path: '',
   redirectTo:'login',
   pathMatch: 'full'
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
      {  path: '', redirectTo: 'home', pathMatch: 'full' },
      {  path: 'home', component: HomeScreenComponent},
      {  path: 'recyclebin', component: RecycleBinComponent},
      {  path: 'chrome', component: ChromeComponent,
        children: [
            { path: '', redirectTo: 'post-section', pathMatch: 'full' },
            { path: 'post-section', component: PostSectionComponent },
            { path: 'developer-section', component: DevelopersComponent }]},
      {  path: 'settings', component: SettingsComponent,
         children: [
            { path:'', redirectTo: 'account', pathMatch: 'full' },
            { path: 'display', component: DisplayComponent },
            { path: 'account', component: AccountComponent }]},
      { path: 'help', component: HelpSectionComponent},
      { path: 'files', component: FileExplorerComponent,
        children: [
            { path:'', redirectTo: 'posted', pathMatch: 'full' },
            { path: 'posted', component: PostedPostComponent },
            { path: 'devlist', component: DevlistComponent },
            { path: 'draft', component: DraftsComponent }]},
      { path: 'post-editor', component: PostEditorComponent,
        children: [
            { path:'', redirectTo: 'create', pathMatch: 'full' },
            { path: 'create', component: CreatePostComponent },
            { path: 'edit/:id', component: EditPostComponent },
            { path: 'draft/:id', component: EditDraftComponent }
         ]
      }]
 }
 
];
