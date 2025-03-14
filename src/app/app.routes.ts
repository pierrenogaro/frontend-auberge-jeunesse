import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {CreateRoomComponent} from './pages/room/create-room/create-room.component';
import {RoomListComponent} from './pages/room/room-list/room-list.component';
import {EditRoomComponent} from './pages/room/edit-room/edit-room.component';
import {BedListComponent} from './pages/bed/bed-list/bed-list.component';
import {CreateBedComponent} from './pages/bed/create-bed/create-bed.component';
import {EditBedComponent} from './pages/bed/edit-bed/edit-bed.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-room', component: CreateRoomComponent, canActivate: [authGuard] },
  { path: 'rooms', component: RoomListComponent },
  { path: 'edit-room/:id', component: EditRoomComponent, canActivate: [authGuard] },
  { path: 'beds', component: BedListComponent },
  { path: 'create-bed', component: CreateBedComponent, canActivate: [authGuard] },
  { path: 'edit-bed/:id', component: EditBedComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
