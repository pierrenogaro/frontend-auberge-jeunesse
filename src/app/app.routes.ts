import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {CreateRoomComponent} from './pages/room/create-room/create-room.component';
import {RoomListComponent} from './pages/room/room-list/room-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-room', component: CreateRoomComponent, canActivate: [authGuard] },
  { path: 'rooms', component: RoomListComponent },
  { path: '**', redirectTo: '' }
];
